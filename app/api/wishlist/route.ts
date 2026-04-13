import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const items = await prisma.wishlist.findMany({
    include: { addedBy: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { restaurantName, location, notes } = await req.json();

  if (!restaurantName) {
    return NextResponse.json({ error: "El nombre es requerido" }, { status: 400 });
  }

  const item = await prisma.wishlist.create({
    data: {
      restaurantName,
      location: location || null,
      notes: notes || null,
      userId: session.userId,
    },
    include: { addedBy: { select: { name: true } } },
  });

  return NextResponse.json(item, { status: 201 });
}
