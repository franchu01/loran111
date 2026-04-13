import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import WishlistClient from "./WishlistClient";

export default async function WishlistPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return <WishlistClient userName={session.userName} currentUserId={session.userId} />;
}
