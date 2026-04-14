"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, UtensilsCrossed } from "lucide-react";
import AppShell from "@/components/AppShell";
import EntryCard from "@/components/EntryCard";
import { SkeletonEntryCard } from "@/components/Skeleton";

interface Entry {
  id: string;
  restaurantName: string;
  rating: number;
  date: string;
  location: string;
  shouldReturn: boolean;
  createdBy: { name: string };
}

type Filter = "all" | "return" | "no-return";

export default function LogPage({ userName }: { userName: string }) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);

  const fetchEntries = useCallback(async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (filter !== "all") params.set("filter", filter);

    const res = await fetch(`/api/entries?${params}`);
    if (res.ok) {
      const data = await res.json();
      setEntries(data);
    }
    setLoading(false);
  }, [search, filter]);

  useEffect(() => {
    const timeout = setTimeout(fetchEntries, 200);
    return () => clearTimeout(timeout);
  }, [fetchEntries]);

  return (
    <AppShell userName={userName}>
      <div className="px-4 pt-5 pb-6">
        {/* Search */}
        <div className="relative mb-4">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-gray pointer-events-none"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar restaurante..."
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-white border border-[#3C241520] text-espresso placeholder:text-warm-gray outline-none focus:ring-2 focus:ring-espresso focus:border-transparent transition-all text-sm"
          />
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-5">
          {(["all", "return", "no-return"] as Filter[]).map((f) => {
            const labels: Record<Filter, string> = {
              all: "Todos",
              return: "Volvería",
              "no-return": "No volvería",
            };
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  filter === f
                    ? "bg-espresso text-white"
                    : "bg-white text-warm-gray border border-[#3C241520]"
                }`}
              >
                {labels[f]}
              </button>
            );
          })}
        </div>

        {/* Entries list */}
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 0.6, 0.35].map((opacity, i) => (
              <SkeletonEntryCard key={i} opacity={opacity} />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-pale-oak flex items-center justify-center">
              <UtensilsCrossed size={28} className="text-espresso/50" />
            </div>
            <div>
              <p className="text-espresso font-semibold text-lg">
                {search || filter !== "all"
                  ? "No hay resultados"
                  : "Todavía no hay aventuras culinarias"}
              </p>
              <p className="text-warm-gray text-sm mt-1">
                {search || filter !== "all"
                  ? "Probá con otros filtros"
                  : "¡Agregá la primera!"}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 animate-fade-in">
            {entries.map((entry) => (
              <EntryCard
                key={entry.id}
                id={entry.id}
                restaurantName={entry.restaurantName}
                rating={entry.rating}
                date={entry.date}
                location={entry.location}
                shouldReturn={entry.shouldReturn}
                creatorName={entry.createdBy.name}
              />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
