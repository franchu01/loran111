"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.toLowerCase().trim(), password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Error al iniciar sesión");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div
      className="bg-pale-oak flex items-center justify-center p-6"
      style={{
        minHeight: "100dvh",
        paddingTop: "calc(var(--sat) + 24px)",
        paddingBottom: "calc(var(--sab) + 24px)",
      }}
    >
      <div className="w-full max-w-sm animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1
            className="text-5xl text-espresso tracking-tight mb-2"
            style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 700 }}
          >
            Loran
          </h1>
          <p className="text-warm-gray italic text-sm">
            Nuestro diario gastronómico
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-espresso">
                Nombre
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="lola o fran"
                required
                autoCapitalize="off"
                autoComplete="username"
                className="h-12 rounded-xl border border-[#3C241540] px-4 text-espresso placeholder:text-warm-gray outline-none focus:ring-2 focus:ring-espresso focus:border-transparent transition-all text-base bg-white"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-espresso">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                required
                autoComplete="current-password"
                className="h-12 rounded-xl border border-[#3C241540] px-4 text-espresso placeholder:text-warm-gray outline-none focus:ring-2 focus:ring-espresso focus:border-transparent transition-all text-base bg-white"
              />
            </div>

            {error && (
              <p className="text-red-soft text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="h-12 bg-espresso text-white rounded-xl font-semibold text-base transition-all duration-200 hover:bg-espresso-light active:scale-95 disabled:opacity-60 mt-2"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
