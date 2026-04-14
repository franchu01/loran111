import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const count = await prisma.message.count({
    where: { receiverId: session.userId, read: false },
  });

  return NextResponse.json({ count });
}
