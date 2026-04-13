import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import StatsClient from "./StatsClient";

export default async function StatsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return <StatsClient userName={session.userName} />;
}
