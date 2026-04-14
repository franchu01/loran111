import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const others = await prisma.user.findMany({
    where: { id: { not: session.userId } },
    select: { id: true, name: true },
  });

  const conversations = await Promise.all(
    others.map(async (user) => {
      const lastMessage = await prisma.message.findFirst({
        where: {
          OR: [
            { senderId: session.userId, receiverId: user.id },
            { senderId: user.id, receiverId: session.userId },
          ],
        },
        orderBy: { createdAt: "desc" },
      });

      const unreadCount = await prisma.message.count({
        where: { senderId: user.id, receiverId: session.userId, read: false },
      });

      return {
        userId: user.id,
        userName: user.name,
        lastMessage: lastMessage
          ? {
              content: lastMessage.content,
              createdAt: lastMessage.createdAt,
              fromMe: lastMessage.senderId === session.userId,
            }
          : null,
        unreadCount,
      };
    })
  );

  return NextResponse.json(
    conversations.sort((a, b) => {
      if (!a.lastMessage) return 1;
      if (!b.lastMessage) return -1;
      return (
        new Date(b.lastMessage.createdAt).getTime() -
        new Date(a.lastMessage.createdAt).getTime()
      );
    })
  );
}
