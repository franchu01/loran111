import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import MensajesClient from "./MensajesClient";

export default async function MensajesPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return <MensajesClient userName={session.userName} />;
}
