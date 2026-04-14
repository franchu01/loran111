import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ChatClient from "./ChatClient";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { userId } = await params;

  const otherUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true },
  });

  if (!otherUser) redirect("/mensajes");

  return (
    <ChatClient
      currentUserId={session.userId}
      userName={session.userName}
      otherUser={otherUser}
    />
  );
}
