"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Crown,
  ThumbsDown,
  RotateCcw,
  FileText,
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import AppShell from "@/components/AppShell";
import StarRating from "@/components/StarRating";
import UserBadge from "@/components/UserBadge";
import ConfirmDialog from "@/components/ConfirmDialog";
import { SkeletonEntryDetail } from "@/components/Skeleton";
import { formatDate, parseOrderedItems } from "@/lib/utils";

interface Entry {
  id: string;
  restaurantName: string;
  location: string;
  date: string;
  rating: number;
  orderedItems: string;
  bestItem: string;
  worstItem: string;
  shouldReturn: boolean;
  notes?: string | null;
  userId: string;
  createdBy: { name: string };
}

export default function EntryDetailClient({
  id,
  currentUserId,
  userName,
}: {
  id: string;
  currentUserId: string;
  userName: string;
}) {
  const router = useRouter();
  const [entry, setEntry] = useState<Entry | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    fetch(`/api/entries/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setEntry(data);
        setLoading(false);
      });
  }, [id]);

  async function handleDelete() {
    await fetch(`/api/entries/${id}`, { method: "DELETE" });
    router.push("/");
  }

  if (loading) {
    return (
      <AppShell userName={userName}>
        <SkeletonEntryDetail />
      </AppShell>
    );
  }

  if (!entry) {
    return (
      <AppShell userName={userName}>
        <div className="p-4 text-center text-warm-gray">No encontrado</div>
      </AppShell>
    );
  }

  const items = parseOrderedItems(entry.orderedItems);
  const isOwner = entry.userId === currentUserId;

  return (
    <AppShell userName={userName}>
      <div className="px-4 pt-4 pb-8 animate-fade-in">
        {/* Back button */}
        <Link
          href="/"
          className="flex items-center gap-1.5 text-warm-gray hover:text-espresso transition-colors mb-5 text-sm font-medium"
        >
          <ArrowLeft size={16} />
          Volver al log
        </Link>

        {/* Header card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-4">
          <div className="flex items-start justify-between gap-2 mb-3">
            <h1
              className="text-2xl text-espresso leading-tight"
              style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 700 }}
            >
              {entry.restaurantName}
            </h1>
            <UserBadge name={entry.createdBy.name} size="md" />
          </div>
          <StarRating value={entry.rating} readonly size={26} />
        </div>

        {/* Info cards */}
        <div className="flex flex-col gap-3">
          {/* Date & Location */}
          <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-pale-oak flex items-center justify-center shrink-0">
                <Calendar size={18} className="text-espresso" />
              </div>
              <div>
                <p className="text-xs text-warm-gray font-medium uppercase tracking-wide">Fecha</p>
                <p className="text-espresso font-medium">{formatDate(entry.date)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-pale-oak flex items-center justify-center shrink-0">
                <MapPin size={18} className="text-espresso" />
              </div>
              <div>
                <p className="text-xs text-warm-gray font-medium uppercase tracking-wide">Ubicación</p>
                <p className="text-espresso font-medium">{entry.location}</p>
              </div>
            </div>
          </div>

          {/* Ordered items */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="text-xs text-warm-gray font-medium uppercase tracking-wide mb-3">
              Lo que pedimos
            </p>
            <div className="flex flex-wrap gap-2">
              {items.map((item, i) => (
                <span
                  key={i}
                  className="bg-pale-oak text-espresso text-sm px-3 py-1.5 rounded-full font-medium"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Best & Worst */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Crown size={16} className="text-espresso" />
                <p className="text-xs text-warm-gray font-medium uppercase tracking-wide">Lo mejor</p>
              </div>
              <p className="text-espresso font-semibold text-sm">{entry.bestItem}</p>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <ThumbsDown size={16} className="text-warm-gray" />
                <p className="text-xs text-warm-gray font-medium uppercase tracking-wide">Lo peor</p>
              </div>
              <p className="text-espresso font-semibold text-sm">{entry.worstItem}</p>
            </div>
          </div>

          {/* Should return */}
          <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                entry.shouldReturn ? "bg-green-soft/10" : "bg-red-soft/10"
              }`}
            >
              <RotateCcw
                size={18}
                className={entry.shouldReturn ? "text-green-soft" : "text-red-soft"}
              />
            </div>
            <div>
              <p className="text-xs text-warm-gray font-medium uppercase tracking-wide">
                ¿Volvemos?
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                {entry.shouldReturn ? (
                  <>
                    <CheckCircle size={16} className="text-green-soft" />
                    <span className="text-green-soft font-semibold">Sí, volvemos</span>
                  </>
                ) : (
                  <>
                    <XCircle size={16} className="text-red-soft" />
                    <span className="text-red-soft font-semibold">No volvemos</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Notes */}
          {entry.notes && (
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <FileText size={16} className="text-espresso" />
                <p className="text-xs text-warm-gray font-medium uppercase tracking-wide">Notas</p>
              </div>
              <p className="text-espresso text-sm leading-relaxed">{entry.notes}</p>
            </div>
          )}

          {/* Owner actions */}
          {isOwner && (
            <div className="flex gap-3 mt-2">
              <Link
                href={`/entry/${id}/edit`}
                className="flex-1 h-12 flex items-center justify-center gap-2 border border-[#3C241540] text-espresso rounded-xl font-medium text-sm hover:bg-pale-oak/50 transition-colors"
              >
                <Pencil size={16} />
                Editar
              </Link>
              <button
                onClick={() => setShowDelete(true)}
                className="flex-1 h-12 flex items-center justify-center gap-2 bg-red-soft/10 text-red-soft rounded-xl font-medium text-sm hover:bg-red-soft/20 transition-colors"
              >
                <Trash2 size={16} />
                Eliminar
              </button>
            </div>
          )}
        </div>
      </div>

      {showDelete && (
        <ConfirmDialog
          title="¿Eliminar entrada?"
          message={`¿Seguro que querés eliminar "${entry.restaurantName}"? Esta acción no se puede deshacer.`}
          confirmLabel="Eliminar"
          destructive
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}
    </AppShell>
  );
}
