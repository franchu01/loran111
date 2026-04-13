export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6">
      <div className="text-center animate-fade-in">
        <h1
          className="text-4xl text-espresso mb-3"
          style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 700 }}
        >
          Loran
        </h1>
        <p className="text-warm-gray text-base mb-1">Sin conexión</p>
        <p className="text-warm-gray text-sm">
          Revisá tu conexión a internet e intentá de nuevo.
        </p>
      </div>
    </div>
  );
}
