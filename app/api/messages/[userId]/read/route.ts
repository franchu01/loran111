import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function PUT(
  _req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { userId } = await params;

  await prisma.message.updateMany({
    where: { senderId: userId, receiverId: session.userId, read: false },
    data: { read: true },
  });

  return NextResponse.json({ ok: true });
}
