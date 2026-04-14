"use client";

import { useState, useEffect } from "react";
import { UtensilsCrossed, Star, RotateCcw, Trophy, ShoppingBag, Users, MapPin } from "lucide-react";
import AppShell from "@/components/AppShell";
import StarRating from "@/components/StarRating";
import { SkeletonStats } from "@/components/Skeleton";
import { formatDate } from "@/lib/utils";

interface StatsData {
  total: number;
  avgRating: number;
  returnPct: number;
  topRated: Array<{
    id: string;
    restaurantName: string;
    location: string;
    date: string;
    rating: number;
  }>;
  mostOrderedItem: [string, number] | null;
  byUser: Record<string, number>;
  recent: Array<{
    id: string;
    restaurantName: string;
    location: string;
    date: string;
    rating: number;
  }>;
}

export default function StatsClient({ userName }: { userName: string }) {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <AppShell userName={userName}>
        <SkeletonStats />
      </AppShell>
    );
  }

  if (!stats || stats.total === 0) {
    return (
      <AppShell userName={userName}>
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center px-4">
          <div className="w-16 h-16 rounded-2xl bg-pale-oak flex items-center justify-center">
            <UtensilsCrossed size={28} className="text-espresso/50" />
          </div>
          <div>
            <p className="text-espresso font-semibold text-lg">Sin estadísticas todavía</p>
            <p className="text-warm-gray text-sm mt-1">
              Agregá algunas entradas para ver tus stats
            </p>
          </div>
        </div>
      </AppShell>
    );
  }

  const userEntries = Object.entries(stats.byUser);

  return (
    <AppShell userName={userName}>
      <div className="px-4 pt-5 pb-8 flex flex-col gap-4 animate-fade-in">
        <h2
          className="text-2xl text-espresso"
          style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 700 }}
        >
          Estadísticas
        </h2>

        {/* Top stats grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col gap-1">
            <div className="flex items-center gap-2 text-warm-gray mb-1">
              <UtensilsCrossed size={16} />
              <span className="text-xs font-medium uppercase tracking-wide">Total</span>
            </div>
            <p
              className="text-4xl text-espresso font-bold"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              {stats.total}
            </p>
            <p className="text-warm-gray text-xs">restaurantes</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col gap-1">
            <div className="flex items-center gap-2 text-warm-gray mb-1">
              <Star size={16} />
              <span className="text-xs font-medium uppercase tracking-wide">Promedio</span>
            </div>
            <p
              className="text-4xl text-espresso font-bold"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              {stats.avgRating}
            </p>
            <div className="mt-0.5">
              <StarRating value={Math.round(stats.avgRating)} readonly size={14} />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col gap-1">
            <div className="flex items-center gap-2 text-warm-gray mb-1">
              <RotateCcw size={16} />
              <span className="text-xs font-medium uppercase tracking-wide">Volveríamos</span>
            </div>
            <p
              className="text-4xl text-espresso font-bold"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              {stats.returnPct}%
            </p>
            <div className="w-full bg-pale-oak rounded-full h-1.5 mt-1">
              <div
                className="bg-green-soft rounded-full h-1.5 transition-all"
                style={{ width: `${stats.returnPct}%` }}
              />
            </div>
          </div>

          {stats.mostOrderedItem && (
            <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col gap-1">
              <div className="flex items-center gap-2 text-warm-gray mb-1">
                <ShoppingBag size={16} />
                <span className="text-xs font-medium uppercase tracking-wide">Más pedido</span>
              </div>
              <p className="text-espresso font-bold text-base leading-tight capitalize">
                {stats.mostOrderedItem[0]}
              </p>
              <p className="text-warm-gray text-xs">{stats.mostOrderedItem[1]} veces</p>
            </div>
          )}
        </div>

        {/* Entries by user */}
        {userEntries.length > 0 && (
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 text-warm-gray mb-4">
              <Users size={16} />
              <span className="text-xs font-medium uppercase tracking-wide">
                Entradas por persona
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {userEntries.map(([name, count]) => {
                const pct = Math.round((count / stats.total) * 100);
                return (
                  <div key={name} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-espresso flex items-center justify-center text-white text-xs font-semibold">
                          {name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-espresso font-medium capitalize">{name}</span>
                      </div>
                      <span className="text-warm-gray text-sm">{count}</span>
                    </div>
                    <div className="w-full bg-pale-oak rounded-full h-2">
                      <div
                        className="bg-espresso rounded-full h-2 transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Top rated */}
        {stats.topRated.length > 0 && (
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 text-warm-gray mb-4">
              <Trophy size={16} />
              <span className="text-xs font-medium uppercase tracking-wide">
                5 estrellas ⭐
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {stats.topRated.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p
                      className="text-espresso font-semibold truncate"
                      style={{ fontFamily: "var(--font-playfair), serif" }}
                    >
                      {entry.restaurantName}
                    </p>
                    <div className="flex items-center gap-1 text-warm-gray text-xs mt-0.5">
                      <MapPin size={11} />
                      <span className="truncate">{entry.location}</span>
                    </div>
                  </div>
                  <StarRating value={5} readonly size={14} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent */}
        {stats.recent.length > 0 && (
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-warm-gray mb-4">
              Últimas visitas
            </p>
            <div className="flex flex-col divide-y divide-pale-oak">
              {stats.recent.map((entry, i) => (
                <div key={entry.id} className={`flex items-center justify-between gap-2 ${i > 0 ? "pt-3" : ""} ${i < stats.recent.length - 1 ? "pb-3" : ""}`}>
                  <div className="min-w-0">
                    <p
                      className="text-espresso font-semibold truncate"
                      style={{ fontFamily: "var(--font-playfair), serif" }}
                    >
                      {entry.restaurantName}
                    </p>
                    <p className="text-warm-gray text-xs mt-0.5">{formatDate(entry.date)}</p>
                  </div>
                  <StarRating value={entry.rating} readonly size={14} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
