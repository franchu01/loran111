import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import EntryForm from "@/components/EntryForm";

export default async function NewEntryPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; location?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { from, location } = await searchParams;

  const initialData =
    from
      ? {
          restaurantName: from,
          location: location || "",
          date: new Date().toISOString(),
          rating: 0,
          orderedItems: "[]",
          bestItem: "",
          worstItem: "",
          shouldReturn: true,
        }
      : undefined;

  return (
    <AppShell userName={session.userName}>
      <div className="pb-8">
        <div className="px-4 pt-4 mb-2">
          <Link
            href={from ? "/wishlist" : "/"}
            className="flex items-center gap-1.5 text-warm-gray hover:text-espresso transition-colors text-sm font-medium"
          >
            <ArrowLeft size={16} />
            Cancelar
          </Link>
          <h2
            className="text-2xl text-espresso mt-4"
            style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 700 }}
          >
            Nueva entrada
          </h2>
        </div>
        <EntryForm initialData={initialData} />
      </div>
    </AppShell>
  );
}
