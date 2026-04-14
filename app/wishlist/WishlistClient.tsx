"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart, MapPin, Plus, Check, Trash2, X } from "lucide-react";
import AppShell from "@/components/AppShell";
import UserBadge from "@/components/UserBadge";
import ConfirmDialog from "@/components/ConfirmDialog";
import { SkeletonWishlistItem } from "@/components/Skeleton";

interface WishlistItem {
  id: string;
  restaurantName: string;
  location?: string | null;
  notes?: string | null;
  visited: boolean;
  userId: string;
  addedBy: { name: string };
}

export default function WishlistClient({
  userName,
  currentUserId,
}: {
  userName: string;
  currentUserId: string;
}) {
  const router = useRouter();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [visitedPrompt, setVisitedPrompt] = useState<WishlistItem | null>(null);

  // Form state
  const [newName, setNewName] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadItems() {
    const res = await fetch("/api/wishlist");
    if (res.ok) setItems(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    loadItems();
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setSaving(true);
    await fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        restaurantName: newName.trim(),
        location: newLocation.trim() || null,
        notes: newNotes.trim() || null,
      }),
    });
    setNewName("");
    setNewLocation("");
    setNewNotes("");
    setShowForm(false);
    setSaving(false);
    loadItems();
  }

  async function handleMarkVisited(item: WishlistItem) {
    await fetch(`/api/wishlist/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visited: true }),
    });
    setVisitedPrompt(null);
    loadItems();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/wishlist/${id}`, { method: "DELETE" });
    setDeleteId(null);
    loadItems();
  }

  function handleCreateEntry(item: WishlistItem) {
    router.push(
      `/entry/new?from=${encodeURIComponent(item.restaurantName)}&location=${encodeURIComponent(item.location || "")}`
    );
  }

  return (
    <AppShell userName={userName}>
      <div className="px-4 pt-5 pb-8 animate-fade-in">
        <div className="flex items-center justify-between mb-5">
          <h2
            className="text-2xl text-espresso"
            style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 700 }}
          >
            Lista de deseos
          </h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="w-10 h-10 rounded-xl bg-espresso flex items-center justify-center text-white transition-transform duration-200 hover:scale-105 active:scale-95"
          >
            {showForm ? <X size={20} /> : <Plus size={20} />}
          </button>
        </div>

        {/* Add form */}
        {showForm && (
          <form
            onSubmit={handleAdd}
            className="bg-white rounded-2xl p-5 shadow-sm mb-4 flex flex-col gap-3 animate-fade-in"
          >
            <h3 className="text-base font-semibold text-espresso">Agregar restaurante</h3>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nombre del restaurante *"
              required
              className="h-12 rounded-xl border border-[#3C241540] px-4 text-espresso placeholder:text-warm-gray outline-none focus:ring-2 focus:ring-espresso focus:border-transparent transition-all bg-white text-sm"
            />
            <input
              type="text"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              placeholder="Ubicación (opcional)"
              className="h-12 rounded-xl border border-[#3C241540] px-4 text-espresso placeholder:text-warm-gray outline-none focus:ring-2 focus:ring-espresso focus:border-transparent transition-all bg-white text-sm"
            />
            <textarea
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              placeholder="¿Por qué querés ir? (opcional)"
              rows={2}
              className="rounded-xl border border-[#3C241540] px-4 py-3 text-espresso placeholder:text-warm-gray outline-none focus:ring-2 focus:ring-espresso focus:border-transparent transition-all bg-white resize-none text-sm"
            />
            <button
              type="submit"
              disabled={saving}
              className="h-11 bg-espresso text-white rounded-xl font-semibold text-sm transition-all duration-200 hover:bg-espresso-light active:scale-95 disabled:opacity-60"
            >
              {saving ? "Guardando..." : "Guardá"}
            </button>
          </form>
        )}

        {/* Items */}
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 0.6, 0.35].map((opacity, i) => (
              <SkeletonWishlistItem key={i} opacity={opacity} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-pale-oak flex items-center justify-center">
              <Heart size={28} className="text-espresso/50" />
            </div>
            <div>
              <p className="text-espresso font-semibold text-lg">La lista está vacía</p>
              <p className="text-warm-gray text-sm mt-1">
                Agregá los restaurantes que querés visitar
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-2xl p-5 shadow-sm flex flex-col gap-3 border border-[#3C241508] ${
                  item.visited ? "opacity-60" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3
                        className="text-base text-espresso font-semibold truncate"
                        style={{ fontFamily: "var(--font-playfair), serif" }}
                      >
                        {item.restaurantName}
                      </h3>
                      {item.visited && (
                        <span className="shrink-0 text-xs bg-green-soft/10 text-green-soft px-2 py-0.5 rounded-full font-medium">
                          Visitado
                        </span>
                      )}
                    </div>
                    {item.location && (
                      <div className="flex items-center gap-1 text-warm-gray text-sm mt-1">
                        <MapPin size={13} />
                        <span className="truncate">{item.location}</span>
                      </div>
                    )}
                    {item.notes && (
                      <p className="text-warm-gray text-sm mt-1 line-clamp-2">{item.notes}</p>
                    )}
                  </div>
                  <UserBadge name={item.addedBy.name} />
                </div>

                {!item.visited && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setVisitedPrompt(item)}
                      className="flex-1 h-9 flex items-center justify-center gap-1.5 bg-green-soft/10 text-green-soft rounded-xl text-sm font-medium hover:bg-green-soft/20 transition-colors"
                    >
                      <Check size={15} />
                      Visité
                    </button>
                    {item.userId === currentUserId && (
                      <button
                        onClick={() => setDeleteId(item.id)}
                        className="w-9 h-9 flex items-center justify-center bg-red-soft/10 text-red-soft rounded-xl hover:bg-red-soft/20 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete confirm */}
      {deleteId && (
        <ConfirmDialog
          title="¿Eliminar de la lista?"
          message="¿Seguro que querés quitar este restaurante de tu lista de deseos?"
          confirmLabel="Eliminar"
          destructive
          onConfirm={() => handleDelete(deleteId)}
          onCancel={() => setDeleteId(null)}
        />
      )}

      {/* Mark visited prompt */}
      {visitedPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-espresso/30 backdrop-blur-sm"
            onClick={() => setVisitedPrompt(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm animate-fade-in">
            <h3
              className="text-xl text-espresso mb-2"
              style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 700 }}
            >
              ¡Lo visitaron!
            </h3>
            <p className="text-warm-gray text-sm mb-6">
              ¿Querés crear una entrada en el log para{" "}
              <strong className="text-espresso">{visitedPrompt.restaurantName}</strong>?
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  handleMarkVisited(visitedPrompt);
                  handleCreateEntry(visitedPrompt);
                }}
                className="h-11 bg-espresso text-white rounded-xl text-sm font-semibold hover:bg-espresso-light transition-colors"
              >
                Crear entrada en el log
              </button>
              <button
                onClick={() => handleMarkVisited(visitedPrompt)}
                className="h-11 border border-[#3C241540] text-espresso rounded-xl text-sm font-medium hover:bg-pale-oak/50 transition-colors"
              >
                Solo marcar como visitado
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
