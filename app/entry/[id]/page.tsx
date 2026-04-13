import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import EntryDetailClient from "./EntryDetailClient";

export default async function EntryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;
  return <EntryDetailClient id={id} currentUserId={session.userId} userName={session.userName} />;
}
