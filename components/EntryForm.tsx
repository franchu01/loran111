"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import StarRating from "./StarRating";
import ItemTagInput from "./ItemTagInput";
import ToggleSwitch from "./ToggleSwitch";
import { parseOrderedItems, stringifyOrderedItems } from "@/lib/utils";

interface EntryFormProps {
  initialData?: {
    restaurantName: string;
    location: string;
    date: string;
    rating: number;
    orderedItems: string;
    bestItem: string;
    worstItem: string;
    shouldReturn: boolean;
    notes?: string | null;
  };
  entryId?: string;
}

function toDateInputValue(dateStr: string): string {
  return new Date(dateStr).toISOString().split("T")[0];
}

function todayInputValue(): string {
  return new Date().toISOString().split("T")[0];
}

export default function EntryForm({ initialData, entryId }: EntryFormProps) {
  const router = useRouter();
  const isEdit = Boolean(entryId);

  const [restaurantName, setRestaurantName] = useState(initialData?.restaurantName || "");
  const [location, setLocation] = useState(initialData?.location || "");
  const [date, setDate] = useState(
    initialData?.date ? toDateInputValue(initialData.date) : todayInputValue()
  );
  const [rating, setRating] = useState(initialData?.rating || 0);
  const [orderedItems, setOrderedItems] = useState<string[]>(
    initialData?.orderedItems ? parseOrderedItems(initialData.orderedItems) : []
  );
  const [bestItem, setBestItem] = useState(initialData?.bestItem || "");
  const [worstItem, setWorstItem] = useState(initialData?.worstItem || "");
  const [shouldReturn, setShouldReturn] = useState(initialData?.shouldReturn ?? true);
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // Reset best/worst when ordered items change
  useEffect(() => {
    setBestItem((prev) => (orderedItems.includes(prev) ? prev : ""));
    setWorstItem((prev) => (orderedItems.includes(prev) ? prev : ""));
  }, [orderedItems]);

  function validate() {
    const e: Record<string, string> = {};
    if (!restaurantName.trim()) e.restaurantName = "El nombre es requerido";
    if (!location.trim()) e.location = "La ubicación es requerida";
    if (!date) e.date = "La fecha es requerida";
    if (!rating) e.rating = "La puntuación es requerida";
    if (orderedItems.length === 0) e.orderedItems = "Agregá al menos un plato";
    if (!bestItem) e.bestItem = "Seleccioná lo mejor";
    if (!worstItem) e.worstItem = "Seleccioná lo peor";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSaving(true);

    const body = {
      restaurantName: restaurantName.trim(),
      location: location.trim(),
      date,
      rating,
      orderedItems: stringifyOrderedItems(orderedItems),
      bestItem,
      worstItem,
      shouldReturn,
      notes: notes.trim() || null,
    };

    const url = isEdit ? `/api/entries/${entryId}` : "/api/entries";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setSaving(false);

    if (res.ok) {
      const data = await res.json();
      router.push(`/entry/${isEdit ? entryId : data.id}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-4 py-6">
      {/* Restaurant name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-espresso">Restaurante *</label>
        <input
          type="text"
          value={restaurantName}
          onChange={(e) => setRestaurantName(e.target.value)}
          placeholder="¿Dónde fueron?"
          className="h-12 rounded-xl border border-[#3C241540] px-4 text-espresso placeholder:text-warm-gray outline-none focus:ring-2 focus:ring-espresso focus:border-transparent transition-all bg-white"
        />
        {errors.restaurantName && (
          <p className="text-red-soft text-xs">{errors.restaurantName}</p>
        )}
      </div>

      {/* Location */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-espresso">Ubicación *</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Barrio o dirección"
          className="h-12 rounded-xl border border-[#3C241540] px-4 text-espresso placeholder:text-warm-gray outline-none focus:ring-2 focus:ring-espresso focus:border-transparent transition-all bg-white"
        />
        {errors.location && (
          <p className="text-red-soft text-xs">{errors.location}</p>
        )}
      </div>

      {/* Date */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-espresso">Fecha *</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="h-12 rounded-xl border border-[#3C241540] px-4 text-espresso outline-none focus:ring-2 focus:ring-espresso focus:border-transparent transition-all bg-white"
        />
        {errors.date && <p className="text-red-soft text-xs">{errors.date}</p>}
      </div>

      {/* Rating */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-espresso">Puntuación *</label>
        <StarRating value={rating} onChange={setRating} size={32} />
        {errors.rating && <p className="text-red-soft text-xs">{errors.rating}</p>}
      </div>

      {/* Ordered items */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-espresso">¿Qué pedimos? *</label>
        <ItemTagInput items={orderedItems} onChange={setOrderedItems} />
        {errors.orderedItems && (
          <p className="text-red-soft text-xs">{errors.orderedItems}</p>
        )}
      </div>

      {/* Best item */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-espresso">Lo mejor *</label>
        <select
          value={bestItem}
          onChange={(e) => setBestItem(e.target.value)}
          disabled={orderedItems.length === 0}
          className="h-12 rounded-xl border border-[#3C241540] px-4 text-espresso outline-none focus:ring-2 focus:ring-espresso focus:border-transparent transition-all bg-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">
            {orderedItems.length === 0
              ? "Primero agregá platos"
              : "Seleccioná lo mejor"}
          </option>
          {orderedItems.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        {errors.bestItem && (
          <p className="text-red-soft text-xs">{errors.bestItem}</p>
        )}
      </div>

      {/* Worst item */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-espresso">Lo peor *</label>
        <select
          value={worstItem}
          onChange={(e) => setWorstItem(e.target.value)}
          disabled={orderedItems.length === 0}
          className="h-12 rounded-xl border border-[#3C241540] px-4 text-espresso outline-none focus:ring-2 focus:ring-espresso focus:border-transparent transition-all bg-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">
            {orderedItems.length === 0
              ? "Primero agregá platos"
              : "Seleccioná lo peor"}
          </option>
          {orderedItems.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        {errors.worstItem && (
          <p className="text-red-soft text-xs">{errors.worstItem}</p>
        )}
      </div>

      {/* Should return */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <p className="text-sm font-semibold text-espresso mb-3">¿Deberíamos volver?</p>
        <ToggleSwitch
          checked={shouldReturn}
          onChange={setShouldReturn}
          label={shouldReturn ? "Sí, volvemos" : "No volvemos"}
        />
      </div>

      {/* Notes */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-espresso">
          Notas <span className="text-warm-gray font-normal">(opcional)</span>
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Comentarios, anécdotas, recomendaciones..."
          rows={4}
          className="rounded-xl border border-[#3C241540] px-4 py-3 text-espresso placeholder:text-warm-gray outline-none focus:ring-2 focus:ring-espresso focus:border-transparent transition-all bg-white resize-none leading-relaxed"
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="h-12 bg-espresso text-white rounded-xl font-semibold text-base transition-all duration-200 hover:bg-espresso-light active:scale-95 disabled:opacity-60 mt-2"
      >
        {saving ? "Guardando..." : "Guardá"}
      </button>
    </form>
  );
}
