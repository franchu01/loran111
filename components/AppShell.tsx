"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BookOpen, BarChart2, LogOut, Heart, Plus } from "lucide-react";
import { getUserInitial } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
  userName: string;
}

// ── Tab definitions ───────────────────────────────────────────────────────────

const TABS = [
  {
    id: "log",
    href: "/",
    label: "Log",
    icon: (active: boolean) => (
      <BookOpen
        size={21}
        strokeWidth={active ? 2.5 : 1.8}
        color={active ? "#3C2E22" : "#BDB0A0"}
      />
    ),
  },
  {
    id: "deseos",
    href: "/wishlist",
    label: "Deseos",
    icon: (active: boolean) => (
      <Heart
        size={21}
        strokeWidth={active ? 2.5 : 1.8}
        color={active ? "#3C2E22" : "#BDB0A0"}
        fill={active ? "#3C2E22" : "none"}
      />
    ),
  },
  null, // + center button
  {
    id: "mensajes",
    href: "/mensajes",
    label: "Mensajes",
    icon: (active: boolean) => (
      <svg
        width="21"
        height="21"
        viewBox="0 0 24 24"
        fill={active ? "#3C2E22" : "none"}
        stroke={active ? "#3C2E22" : "#BDB0A0"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    id: "stats",
    href: "/stats",
    label: "Stats",
    icon: (active: boolean) => (
      <BarChart2
        size={21}
        strokeWidth={active ? 2.5 : 1.8}
        color={active ? "#3C2E22" : "#BDB0A0"}
      />
    ),
  },
] as const;

// ── Component ─────────────────────────────────────────────────────────────────

export default function AppShell({ children, userName }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [unread, setUnread] = useState(0);

  // Fetch unread count on every navigation
  useEffect(() => {
    if (pathname.startsWith("/mensajes")) {
      setUnread(0);
      return;
    }
    fetch("/api/messages/unread")
      .then((r) => r.json())
      .then((d) => setUnread(d.count ?? 0))
      .catch(() => {});
  }, [pathname]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <div className="flex flex-col bg-cream" style={{ minHeight: "100dvh" }}>

      {/* ── Top bar ───────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-40 flex items-end justify-between px-5 pb-3"
        style={{
          paddingTop: "calc(var(--sat) + 12px)",
          background: "rgba(245,242,237,0.88)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(60,36,21,0.07)",
        }}
      >
        <div className="w-[72px]" />
        <h1
          className="text-[26px] text-espresso tracking-tight leading-none"
          style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 700 }}
        >
          Loran
        </h1>
        <div className="flex items-center gap-2 w-[72px] justify-end">
          <div className="w-8 h-8 rounded-full bg-espresso flex items-center justify-center text-white text-sm font-semibold select-none">
            {getUserInitial(userName)}
          </div>
          <button
            onClick={handleLogout}
            className="text-warm-gray active:text-espresso transition-colors p-1"
            aria-label="Cerrar sesión"
          >
            <LogOut size={17} strokeWidth={2} />
          </button>
        </div>
      </header>

      {/* ── Main content ──────────────────────────────────────────── */}
      <main
        className="flex-1 scroll-area"
        style={{ paddingBottom: "calc(var(--sab) + 88px)" }}
      >
        {children}
      </main>

      {/* ── Bottom navigation (notch style) ───────────────────────── */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 40,
        }}
      >
        {/* Gradient fade above bar */}
        <div
          style={{
            height: 30,
            background: "linear-gradient(to top, #FAF6F1, transparent)",
            pointerEvents: "none",
          }}
        />

        {/* Notch bar */}
        <div style={{ position: "relative" }}>

          {/* Floating + button */}
          <div
            style={{
              position: "absolute",
              top: -28,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 10,
            }}
          >
            <Link
              href="/entry/new"
              aria-label="Nueva entrada"
              className="tap-scale transition-transform duration-150"
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "#3C2E22",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 14px rgba(60,46,34,0.45)",
                }}
              >
                <Plus size={26} color="white" strokeWidth={2.5} />
              </div>
            </Link>
          </div>

          {/* SVG notch background */}
          <svg
            width="100%"
            height="70"
            viewBox="0 0 420 70"
            preserveAspectRatio="none"
            style={{ position: "absolute", top: 0, left: 0 }}
          >
            <defs>
              <clipPath id="bar-notch">
                <path d="M0,0 H175 C175,0 178,0 182,8 C188,20 195,30 210,30 C225,30 232,20 238,8 C242,0 245,0 245,0 H420 V70 H0 Z" />
              </clipPath>
            </defs>
            {/* Filled background */}
            <rect
              width="420"
              height="70"
              fill="rgba(255,255,255,0.94)"
              clipPath="url(#bar-notch)"
            />
            {/* Subtle top-edge stroke following the notch */}
            <path
              d="M0,0 H175 C175,0 178,0 182,8 C188,20 195,30 210,30 C225,30 232,20 238,8 C242,0 245,0 245,0 H420"
              fill="none"
              stroke="rgba(180,160,130,0.18)"
              strokeWidth="1"
            />
          </svg>

          {/* Tab buttons */}
          <div
            style={{
              position: "relative",
              zIndex: 5,
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              height: 70,
              padding: "6px 8px 0",
            }}
          >
            {TABS.map((tab, i) => {
              // Center placeholder for + button
              if (tab === null) {
                return <div key="add" style={{ width: 56, flexShrink: 0 }} />;
              }

              const active = isActive(tab.href);

              return (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className="tap-scale transition-transform duration-150"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 3,
                    padding: "4px 10px",
                    flex: 1,
                    textDecoration: "none",
                  }}
                >
                  {/* Icon wrapper with badge for Mensajes */}
                  <div style={{ position: "relative" }}>
                    {tab.icon(active)}
                    {tab.id === "mensajes" && unread > 0 && (
                      <div
                        style={{
                          position: "absolute",
                          top: -4,
                          right: -5,
                          width: 15,
                          height: 15,
                          borderRadius: "50%",
                          background: "#C0392B",
                          border: "2px solid #FAF6F1",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: 8,
                          fontWeight: 700,
                          lineHeight: 1,
                        }}
                      >
                        {unread > 9 ? "9+" : unread}
                      </div>
                    )}
                  </div>
                  {/* Label */}
                  <span
                    style={{
                      fontSize: 10.5,
                      fontWeight: active ? 700 : 500,
                      color: active ? "#3C2E22" : "#BDB0A0",
                      fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                      lineHeight: 1,
                      letterSpacing: "0.01em",
                    }}
                  >
                    {tab.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Safe area spacer */}
        <div
          style={{
            height: "var(--sab)",
            background: "rgba(255,255,255,0.94)",
          }}
        />
      </div>
    </div>
  );
}
