"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, Star, Plus, BarChart2, LogOut, Heart } from "lucide-react";
import { getUserInitial } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
  userName: string;
}

export default function AppShell({ children, userName }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const navItems = [
    { href: "/", icon: BookOpen, label: "Log" },
    { href: "/wishlist", icon: Heart, label: "Deseos" },
    { href: "/stats", icon: BarChart2, label: "Stats" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-cream">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-cream border-b border-[#3C241520] px-4 py-3 flex items-center justify-between">
        <div className="w-8" />
        <h1
          className="text-2xl text-espresso tracking-tight"
          style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 700 }}
        >
          Loran
        </h1>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-espresso flex items-center justify-center text-white text-sm font-semibold">
            {getUserInitial(userName)}
          </div>
          <button
            onClick={handleLogout}
            className="text-warm-gray hover:text-espresso transition-colors p-1"
            aria-label="Cerrar sesión"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 pb-24">{children}</main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#3C241520] flex items-center justify-around px-2 py-2 safe-area-pb">
        {navItems.slice(0, 2).map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-colors ${
                active ? "text-espresso" : "text-warm-gray"
              }`}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 2} />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}

        {/* Center Add button */}
        <Link
          href="/entry/new"
          className="flex flex-col items-center -mt-5"
        >
          <div className="w-14 h-14 rounded-2xl bg-espresso flex items-center justify-center shadow-lg shadow-espresso/30 transition-transform duration-200 hover:scale-105 active:scale-95">
            <Plus size={28} color="white" strokeWidth={2.5} />
          </div>
        </Link>

        {navItems.slice(2).map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-colors ${
                active ? "text-espresso" : "text-warm-gray"
              }`}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 2} />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
