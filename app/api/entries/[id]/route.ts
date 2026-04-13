import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const entry = await prisma.entry.findUnique({
    where: { id },
    include: { createdBy: { select: { name: true } } },
  });

  if (!entry) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(entry);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const entry = await prisma.entry.findUnique({ where: { id } });

  if (!entry) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  if (entry.userId !== session.userId) {
    return NextResponse.json({ error: "Sin permiso" }, { status: 403 });
  }

  const body = await req.json();
  const { restaurantName, location, date, rating, orderedItems, bestItem, worstItem, shouldReturn, notes } = body;

  const updated = await prisma.entry.update({
    where: { id },
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
    },
    include: { createdBy: { select: { name: true } } },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const entry = await prisma.entry.findUnique({ where: { id } });

  if (!entry) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  if (entry.userId !== session.userId) {
    return NextResponse.json({ error: "Sin permiso" }, { status: 403 });
  }

  await prisma.entry.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
