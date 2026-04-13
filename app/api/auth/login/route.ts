import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { name, password } = await req.json();

  if (!name || !password) {
    return NextResponse.json(
      { error: "Nombre y contraseña son requeridos" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({ where: { name: name.toLowerCase() } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json(
      { error: "Nombre o contraseña incorrectos" },
      { status: 401 }
    );
  }

  const token = await signToken({ userId: user.id, userName: user.name });

  const response = NextResponse.json({ ok: true, name: user.name });
  response.cookies.set("loran-session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });

  return response;
}
