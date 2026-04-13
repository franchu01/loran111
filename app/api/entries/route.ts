import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const filter = searchParams.get("filter"); // "return" | "no-return" | null

  const entries = await prisma.entry.findMany({
    where: {
      ...(search && {
        restaurantName: { contains: search, mode: "insensitive" },
      }),
      ...(filter === "return" && { shouldReturn: true }),
      ...(filter === "no-return" && { shouldReturn: false }),
    },
    include: { createdBy: { select: { name: true } } },
    orderBy: { date: "desc" },
  });

  return NextResponse.json(entries);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json();
  const { restaurantName, location, date, rating, orderedItems, bestItem, worstItem, shouldReturn, notes } = body;

  if (!restaurantName || !location || !date || !rating || !orderedItems || !bestItem || !worstItem) {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
  }

  const entry = await prisma.entry.create({
    data: {
      restaurantName,
      location,
      date: new Date(date),
      rating: Number(rating),
      orderedItems: typeof orderedItems === "string" ? orderedItems : JSON.stringify(orderedItems),
      bestItem,
      worstItem,
      shouldReturn: Boolean(shouldReturn),
      notes: notes || null,
      userId: session.userId,
    },
    include: { createdBy: { select: { name: true } } },
  });

  return NextResponse.json(entry, { status: 201 });
}
