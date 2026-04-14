"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send } from "lucide-react";
import AppShell from "@/components/AppShell";
import { SkeletonChatThread } from "@/components/Skeleton";

interface Message {
  id: string;
  content: string;
  fromMe: boolean;
  read: boolean;
  createdAt: string;
}

interface OtherUser {
  id: string;
  name: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────

function msgTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function dayLabel(dateStr: string): string {
  const d = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (sameDay(d, today)) return "Hoy";
  if (sameDay(d, yesterday)) return "Ayer";

  const opts: Intl.DateTimeFormatOptions =
    d.getFullYear() === today.getFullYear()
      ? { day: "numeric", month: "long" }
      : { day: "numeric", month: "long", year: "numeric" };

  return d.toLocaleDateString("es-AR", opts);
}

function groupByDay(messages: Message[]): Array<{ label: string; msgs: Message[] }> {
  const groups: Array<{ label: string; msgs: Message[] }> = [];
  for (const msg of messages) {
    const label = dayLabel(msg.createdAt);
    const last = groups[groups.length - 1];
    if (last && last.label === label) {
      last.msgs.push(msg);
    } else {
      groups.push({ label, msgs: [msg] });
    }
  }
  return groups;
}

// ── Component ──────────────────────────────────────────────────────────────

export default function ChatClient({
  currentUserId,
  userName,
  otherUser,
}: {
  currentUserId: string;
  userName: string;
  otherUser: OtherUser;
}) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const lastCountRef = useRef(0);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    bottomRef.current?.scrollIntoView({ behavior, block: "end" });
  }, []);

  const fetchMessages = useCallback(async () => {
    const res = await fetch(`/api/messages/${otherUser.id}`);
    if (!res.ok) return;
    const data: Message[] = await res.json();
    setMessages(data);
    setLoading(false);
    if (data.length !== lastCountRef.current) {
      lastCountRef.current = data.length;
      // New messages arrived — mark as read and scroll
      if (data.some((m) => !m.fromMe && !m.read)) {
        fetch(`/api/messages/${otherUser.id}/read`, { method: "PUT" });
      }
      setTimeout(() => scrollToBottom("smooth"), 50);
    }
  }, [otherUser.id, scrollToBottom]);

  // Initial load
  useEffect(() => {
    fetchMessages().then(() => {
      setTimeout(() => scrollToBottom("instant"), 80);
    });
    // Mark as read on open
    fetch(`/api/messages/${otherUser.id}/read`, { method: "PUT" });
  }, [fetchMessages, otherUser.id, scrollToBottom]);

  // Poll every 3s
  useEffect(() => {
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  async function handleSend() {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setSending(true);
    setText("");

    const optimistic: Message = {
      id: `tmp-${Date.now()}`,
      content: trimmed,
      fromMe: true,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    lastCountRef.current += 1;
    setTimeout(() => scrollToBottom("smooth"), 50);

    const res = await fetch(`/api/messages/${otherUser.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: trimmed }),
    });

    if (res.ok) {
      const saved: Message = await res.json();
      setMessages((prev) =>
        prev.map((m) => (m.id === optimistic.id ? saved : m))
      );
    }
    setSending(false);
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const groups = groupByDay(messages);

  return (
    <AppShell userName={userName}>
      {/* Sticky chat header */}
      <div
        className="sticky top-0 z-20 flex items-center gap-3 px-4 py-3 border-b border-[#3C241510]"
        style={{
          background: "rgba(245,242,237,0.95)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <button
          onClick={() => router.push("/mensajes")}
          className="text-warm-gray hover:text-espresso transition-colors p-1 -ml-1"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="w-9 h-9 rounded-full bg-espresso flex items-center justify-center text-white font-semibold text-sm select-none shrink-0">
          {otherUser.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p
            className="text-espresso font-semibold capitalize leading-tight"
            style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
          >
            {otherUser.name}
          </p>
          <p className="text-warm-gray text-xs">en Loran</p>
        </div>
      </div>

      {/* Messages */}
      <div className="px-4 pt-4" style={{ paddingBottom: 84 }}>
        {loading ? (
          <SkeletonChatThread />
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <div className="w-14 h-14 rounded-2xl bg-pale-oak flex items-center justify-center">
              <span className="text-2xl">👋</span>
            </div>
            <p className="text-warm-gray text-sm">
              Empezá la conversación con{" "}
              <strong className="text-espresso capitalize">{otherUser.name}</strong>
            </p>
          </div>
        ) : (
          groups.map((group) => (
            <div key={group.label}>
              {/* Day separator */}
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-[#3C241514]" />
                <span className="text-warm-gray text-xs font-medium px-1">{group.label}</span>
                <div className="flex-1 h-px bg-[#3C241514]" />
              </div>

              {/* Messages in this day */}
              <div className="flex flex-col gap-1.5">
                {group.msgs.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.fromMe ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[78%] flex flex-col ${msg.fromMe ? "items-end" : "items-start"}`}>
                      <div
                        className={`px-4 py-2.5 text-sm leading-relaxed ${
                          msg.fromMe
                            ? "bg-espresso text-white rounded-2xl rounded-br-sm"
                            : "text-espresso rounded-2xl rounded-bl-sm"
                        }`}
                        style={
                          msg.fromMe
                            ? undefined
                            : { background: "#F0EAE2" }
                        }
                      >
                        {msg.content}
                      </div>
                      <span className="text-warm-gray text-[10px] mt-1 px-1">
                        {msgTime(msg.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Fixed input bar */}
      <div
        className="fixed left-0 right-0 z-30 px-4 py-2 border-t border-[#3C241510]"
        style={{
          bottom: "calc(var(--sab) + 70px)",
          background: "rgba(245,242,237,0.97)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribí un mensaje..."
            rows={1}
            className="flex-1 rounded-2xl border border-[#3C241530] bg-white px-4 py-2.5 text-sm text-espresso placeholder:text-warm-gray outline-none focus:ring-2 focus:ring-espresso focus:border-transparent transition-all resize-none leading-relaxed"
            style={{ maxHeight: 96 }}
          />
          <button
            onClick={handleSend}
            disabled={!text.trim() || sending}
            className="w-10 h-10 rounded-full bg-espresso flex items-center justify-center text-white transition-all duration-150 hover:bg-espresso-light active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <Send size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </AppShell>
  );
}
