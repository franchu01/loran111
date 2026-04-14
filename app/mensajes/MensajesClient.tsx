"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, MessageCircle } from "lucide-react";
import AppShell from "@/components/AppShell";
import { SkeletonMensajesList } from "@/components/Skeleton";

interface Conversation {
  userId: string;
  userName: string;
  lastMessage: {
    content: string;
    createdAt: string;
    fromMe: boolean;
  } | null;
  unreadCount: number;
}

function formatConvTime(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffDays === 0) {
    return d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false });
  }
  if (diffDays === 1) return "Ayer";
  if (diffDays < 7) {
    return d.toLocaleDateString("es-AR", { weekday: "short" });
  }
  return d.toLocaleDateString("es-AR", { day: "numeric", month: "short" });
}

export default function MensajesClient({ userName }: { userName: string }) {
  const router = useRouter();
  const [convs, setConvs] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/messages")
      .then((r) => r.json())
      .then((data) => {
        setConvs(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = convs.filter((c) =>
    c.userName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppShell userName={userName}>
      <div className="px-4 pt-5 pb-6 animate-fade-in">
        <h2
          className="text-2xl text-espresso mb-4"
          style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 700 }}
        >
          Mensajes
        </h2>

        {/* Search */}
        <div className="relative mb-4">
          <Search
            size={17}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-gray pointer-events-none"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar..."
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-white border border-[#3C241520] text-espresso placeholder:text-warm-gray outline-none focus:ring-2 focus:ring-espresso focus:border-transparent transition-all text-sm"
          />
        </div>

        {loading ? (
          <SkeletonMensajesList />
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-pale-oak flex items-center justify-center">
              <MessageCircle size={28} className="text-espresso/50" />
            </div>
            <div>
              <p className="text-espresso font-semibold text-lg">No tenés mensajes aún</p>
              <p className="text-warm-gray text-sm mt-1">
                Mandale un mensaje a tu compañero de aventuras
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {filtered.map((conv) => (
              <button
                key={conv.userId}
                onClick={() => router.push(`/mensajes/${conv.userId}`)}
                className="w-full flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 shadow-sm border border-[#3C241508] hover:bg-pale-oak/30 active:scale-[0.99] transition-all text-left"
              >
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-espresso flex items-center justify-center text-white text-lg font-semibold shrink-0 select-none">
                  {conv.userName.charAt(0).toUpperCase()}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="text-espresso font-semibold capitalize text-[15px]"
                      style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
                    >
                      {conv.userName}
                    </span>
                    {conv.lastMessage && (
                      <span className="text-warm-gray text-xs shrink-0">
                        {formatConvTime(conv.lastMessage.createdAt)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    <p className="text-warm-gray text-sm truncate">
                      {conv.lastMessage
                        ? `${conv.lastMessage.fromMe ? "Vos: " : ""}${conv.lastMessage.content}`
                        : "Empezá la conversación"}
                    </p>
                    {conv.unreadCount > 0 && (
                      <span className="shrink-0 w-5 h-5 rounded-full bg-espresso text-white text-[10px] font-bold flex items-center justify-center">
                        {conv.unreadCount > 9 ? "9+" : conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
