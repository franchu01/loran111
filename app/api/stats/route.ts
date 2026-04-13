import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { parseOrderedItems } from "@/lib/utils";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const entries = await prisma.entry.findMany({
    include: { createdBy: { select: { name: true } } },
    orderBy: { date: "desc" },
  });

  const total = entries.length;
  const avgRating = total > 0
    ? Math.round((entries.reduce((sum, e) => sum + e.rating, 0) / total) * 10) / 10
    : 0;

  const returnCount = entries.filter((e) => e.shouldReturn).length;
  const returnPct = total > 0 ? Math.round((returnCount / total) * 100) : 0;

  const topRated = entries.filter((e) => e.rating === 5);

  // Count ordered items
  const itemCounts: Record<string, number> = {};
  for (const entry of entries) {
    const items = parseOrderedItems(entry.orderedItems);
    for (const item of items) {
      const key = item.toLowerCase().trim();
      itemCounts[key] = (itemCounts[key] || 0) + 1;
    }
  }
  const sortedItems = Object.entries(itemCounts).sort((a, b) => b[1] - a[1]);
  const mostOrderedItem = sortedItems[0] ?? null;

  // Entries by user
  const byUser: Record<string, number> = {};
  for (const entry of entries) {
    const name = entry.createdBy.name;
    byUser[name] = (byUser[name] || 0) + 1;
  }

  const recent = entries.slice(0, 3);

  return NextResponse.json({
    total,
    avgRating,
    returnPct,
    topRated: topRated.slice(0, 5),
    mostOrderedItem,
    byUser,
    recent,
  });
}
