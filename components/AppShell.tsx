"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, Plus, BarChart2, LogOut, Heart } from "lucide-react";
import { getUserInitial } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
  userName: string;
}

const NAV_ITEMS = [
  { href: "/", icon: BookOpen, label: "Log" },
  { href: "/wishlist", icon: Heart, label: "Deseos" },
  null, // center placeholder for + button
  { href: "/stats", icon: BarChart2, label: "Stats" },
];

export default function AppShell({ children, userName }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="flex flex-col bg-cream" style={{ minHeight: "100dvh" }}>

      {/* ── Top bar ─────────────────────────────────────────────────── */}
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
        {/* Spacer left */}
        <div className="w-[72px]" />

        {/* Logo */}
        <h1
          className="text-[26px] text-espresso tracking-tight leading-none"
          style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 700 }}
        >
          Loran
        </h1>

        {/* Avatar + logout */}
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

      {/* ── Main content ─────────────────────────────────────────────── */}
      <main
        className="flex-1 scroll-area"
        style={{ paddingBottom: "calc(var(--sab) + 80px)" }}
      >
        {children}
      </main>

      {/* ── Bottom navigation ────────────────────────────────────────── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40"
        style={{
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderTop: "1px solid rgba(60,36,21,0.08)",
          paddingBottom: "var(--sab)",
        }}
      >
        <div className="flex items-center justify-around px-2 pt-2 pb-1">
          {NAV_ITEMS.map((item, i) => {
            // Center + button
            if (item === null) {
              return (
                <div key="add" className="flex flex-col items-center flex-1">
                  <Link
                    href="/entry/new"
                    className="tap-scale transition-transform duration-150"
                    aria-label="Nueva entrada"
                  >
                    <div
                      className="w-13 h-13 flex items-center justify-center"
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 16,
                        background: "#3C2415",
                        boxShadow: "0 4px 16px rgba(60,36,21,0.35), 0 1px 3px rgba(60,36,21,0.2)",
                      }}
                    >
                      <Plus size={26} color="white" strokeWidth={2.5} />
                    </div>
                  </Link>
                </div>
              );
            }

            const { href, icon: Icon, label } = item;
            const active = pathname === href;

            return (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center gap-[3px] flex-1 tap-scale transition-transform duration-150"
              >
                {/* Icon with active pill */}
                <div
                  className="flex items-center justify-center transition-all duration-200"
                  style={{
                    width: 48,
                    height: 30,
                    borderRadius: 999,
                    background: active ? "#DDD9CE" : "transparent",
                  }}
                >
                  <Icon
                    size={20}
                    strokeWidth={active ? 2.5 : 1.8}
                    color={active ? "#3C2415" : "#8C8278"}
                  />
                </div>
                {/* Label */}
                <span
                  className="text-[10px] leading-none transition-colors duration-200"
                  style={{
                    fontWeight: active ? 600 : 400,
                    color: active ? "#3C2415" : "#8C8278",
                    letterSpacing: "0.01em",
                  }}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
