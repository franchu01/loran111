import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import EntryForm from "@/components/EntryForm";

export default async function EditEntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;
  const entry = await prisma.entry.findUnique({ where: { id } });

  if (!entry) redirect("/");
  if (entry.userId !== session.userId) redirect(`/entry/${id}`);

  return (
    <AppShell userName={session.userName}>
      <div className="pb-8">
        <div className="px-4 pt-4 mb-2">
          <Link
            href={`/entry/${id}`}
            className="flex items-center gap-1.5 text-warm-gray hover:text-espresso transition-colors text-sm font-medium"
          >
            <ArrowLeft size={16} />
            Cancelar
          </Link>
          <h2
            className="text-2xl text-espresso mt-4"
            style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 700 }}
          >
            Editar entrada
          </h2>
        </div>
        <EntryForm
          entryId={id}
          initialData={{
            restaurantName: entry.restaurantName,
            location: entry.location,
            date: entry.date.toISOString(),
            rating: entry.rating,
            orderedItems: entry.orderedItems,
            bestItem: entry.bestItem,
            worstItem: entry.worstItem,
            shouldReturn: entry.shouldReturn,
            notes: entry.notes,
          }}
        />
      </div>
    </AppShell>
  );
}
