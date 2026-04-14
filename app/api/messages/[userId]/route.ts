import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { sendPushToUser } from "@/lib/push";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { userId } = await params;

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: session.userId, receiverId: userId },
        { senderId: userId, receiverId: session.userId },
      ],
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(
    messages.map((m) => ({
      id: m.id,
      content: m.content,
      fromMe: m.senderId === session.userId,
      read: m.read,
      createdAt: m.createdAt,
    }))
  );
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { userId } = await params;
  const { content } = await req.json();

  if (!content?.trim()) {
    return NextResponse.json({ error: "El mensaje no puede estar vacío" }, { status: 400 });
  }

  const receiver = await prisma.user.findUnique({ where: { id: userId } });
  if (!receiver) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });

  const message = await prisma.message.create({
    data: {
      content: content.trim(),
      senderId: session.userId,
      receiverId: userId,
    },
  });

  sendPushToUser(userId, {
    title: session.userName,
    body: content.trim().slice(0, 100),
    url: `/mensajes/${session.userId}`,
  });

  return NextResponse.json({
    id: message.id,
    content: message.content,
    fromMe: true,
    read: false,
    createdAt: message.createdAt,
  }, { status: 201 });
}
