import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { sendPushToOthers } from "@/lib/push";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const item = await prisma.wishlist.findUnique({ where: { id } });
  if (!item) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  const body = await req.json();
  const updated = await prisma.wishlist.update({
    where: { id },
    data: {
      restaurantName: body.restaurantName ?? item.restaurantName,
      location: body.location !== undefined ? body.location : item.location,
      notes: body.notes !== undefined ? body.notes : item.notes,
      visited: body.visited !== undefined ? body.visited : item.visited,
    },
    include: { addedBy: { select: { name: true } } },
  });

  if (body.visited === true && !item.visited) {
    sendPushToOthers(session.userId, {
      title: "¡Deseo cumplido!",
      body: `${session.userName} marcó ${item.restaurantName} como visitado`,
      url: "/wishlist",
    });
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const item = await prisma.wishlist.findUnique({ where: { id } });
  if (!item) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  if (item.userId !== session.userId) {
    return NextResponse.json({ error: "Sin permiso" }, { status: 403 });
  }

  await prisma.wishlist.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
