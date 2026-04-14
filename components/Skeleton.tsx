// ─── Primitives ───────────────────────────────────────────────────────────────

/** Base shimmer block — rounded-xl by default */
export function Skeleton({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return <div className={`skeleton rounded-xl ${className}`} style={style} />;
}

/** Single text line, height matches the font size it replaces */
export function SkeletonText({
  width = "100%",
  height = 14,
  className = "",
}: {
  width?: string | number;
  height?: number;
  className?: string;
}) {
  return (
    <div
      className={`skeleton rounded-md ${className}`}
      style={{ width, height }}
    />
  );
}

/** Round avatar placeholder */
export function SkeletonAvatar({ size = 32 }: { size?: number }) {
  return (
    <div
      className="skeleton rounded-full shrink-0"
      style={{ width: size, height: size }}
    />
  );
}

/** Row of 5 star-shaped squares */
export function SkeletonStars({ size = 18 }: { size?: number }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="skeleton rounded"
          style={{ width: size, height: size }}
        />
      ))}
    </div>
  );
}

/** White card wrapper matching app cards */
export function SkeletonCard({
  children,
  className = "",
  padding = "p-5",
}: {
  children: React.ReactNode;
  className?: string;
  padding?: string;
}) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm ${padding} ${className}`}>
      {children}
    </div>
  );
}

/** Pill/tag shape */
export function SkeletonPill({ width = 64 }: { width?: number }) {
  return (
    <div
      className="skeleton rounded-full"
      style={{ width, height: 30 }}
    />
  );
}

// ─── Screen-specific skeletons ────────────────────────────────────────────────

/** Mirrors EntryCard exactly */
export function SkeletonEntryCard({ opacity = 1 }: { opacity?: number }) {
  return (
    <div
      className="bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-3 border border-[#3C241508]"
      style={{ opacity }}
    >
      {/* Name row + avatar */}
      <div className="flex items-start justify-between gap-2">
        <SkeletonText width="62%" height={20} />
        <SkeletonAvatar size={32} />
      </div>
      {/* Stars */}
      <SkeletonStars size={18} />
      {/* Location */}
      <SkeletonText width="48%" height={14} />
      {/* Date + return badge */}
      <div className="flex items-center justify-between">
        <SkeletonText width={72} height={13} />
        <SkeletonText width={64} height={13} />
      </div>
    </div>
  );
}

/** Mirrors a wishlist item card exactly */
export function SkeletonWishlistItem({ opacity = 1 }: { opacity?: number }) {
  return (
    <div
      className="bg-white rounded-2xl p-5 shadow-sm flex flex-col gap-3 border border-[#3C241508]"
      style={{ opacity }}
    >
      {/* Name + avatar */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 flex flex-col gap-2">
          <SkeletonText width="58%" height={18} />
          <SkeletonText width="38%" height={13} />
        </div>
        <SkeletonAvatar size={32} />
      </div>
      {/* Action buttons */}
      <div className="flex gap-2">
        <div className="skeleton rounded-xl flex-1 h-9" />
        <div className="skeleton rounded-xl w-9 h-9" />
      </div>
    </div>
  );
}

/** Mirrors the stats 2-col stat tile */
export function SkeletonStatTile() {
  return (
    <SkeletonCard className="flex flex-col gap-1">
      {/* Icon + label row */}
      <div className="flex items-center gap-2 mb-1">
        <Skeleton className="w-4 h-4 rounded" />
        <SkeletonText width={52} height={10} />
      </div>
      {/* Big number */}
      <SkeletonText width={48} height={36} className="rounded-lg" />
      {/* Sub-label */}
      <SkeletonText width={64} height={11} />
    </SkeletonCard>
  );
}

/** Mirrors a stats list row (top-rated / recent) */
export function SkeletonStatsRow() {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <SkeletonText width="55%" height={15} />
        <SkeletonText width="38%" height={12} />
      </div>
      <SkeletonStars size={14} />
    </div>
  );
}

/** Mirrors the full stats screen skeleton */
export function SkeletonStats() {
  return (
    <div className="px-4 pt-5 pb-8 flex flex-col gap-4">
      {/* Title */}
      <SkeletonText width={160} height={28} className="rounded-lg" />

      {/* 2×2 stat tiles */}
      <div className="grid grid-cols-2 gap-3">
        {[...Array(4)].map((_, i) => (
          <SkeletonStatTile key={i} />
        ))}
      </div>

      {/* Entradas por persona card */}
      <SkeletonCard>
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="w-4 h-4 rounded" />
          <SkeletonText width={140} height={10} />
        </div>
        <div className="flex flex-col gap-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SkeletonAvatar size={24} />
                  <SkeletonText width={48} height={14} />
                </div>
                <SkeletonText width={16} height={14} />
              </div>
              <div className="skeleton rounded-full h-2 w-full" />
            </div>
          ))}
        </div>
      </SkeletonCard>

      {/* Top rated card */}
      <SkeletonCard>
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="w-4 h-4 rounded" />
          <SkeletonText width={80} height={10} />
        </div>
        <div className="flex flex-col gap-3">
          {[...Array(2)].map((_, i) => <SkeletonStatsRow key={i} />)}
        </div>
      </SkeletonCard>

      {/* Recent visits card */}
      <SkeletonCard>
        <SkeletonText width={96} height={10} className="mb-4" />
        <div className="flex flex-col gap-3">
          {[...Array(3)].map((_, i) => <SkeletonStatsRow key={i} />)}
        </div>
      </SkeletonCard>
    </div>
  );
}

/** Mirrors the full entry detail screen skeleton */
export function SkeletonEntryDetail() {
  return (
    <div className="px-4 pt-4 pb-8">
      {/* Back link */}
      <SkeletonText width={100} height={14} className="mb-5" />

      {/* Header card */}
      <SkeletonCard className="mb-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <SkeletonText width="65%" height={28} className="rounded-lg" />
          <SkeletonAvatar size={36} />
        </div>
        <SkeletonStars size={26} />
      </SkeletonCard>

      <div className="flex flex-col gap-3">
        {/* Date & location */}
        <SkeletonCard>
          {[...Array(2)].map((_, i) => (
            <div key={i} className={`flex items-center gap-3 ${i > 0 ? "mt-3" : ""}`}>
              <Skeleton className="w-9 h-9 rounded-xl shrink-0" />
              <div className="flex flex-col gap-1.5 flex-1">
                <SkeletonText width={56} height={10} />
                <SkeletonText width="55%" height={15} />
              </div>
            </div>
          ))}
        </SkeletonCard>

        {/* Ordered items */}
        <SkeletonCard>
          <SkeletonText width={96} height={10} className="mb-3" />
          <div className="flex flex-wrap gap-2">
            {[88, 72, 96, 64].map((w, i) => (
              <SkeletonPill key={i} width={w} />
            ))}
          </div>
        </SkeletonCard>

        {/* Best / worst */}
        <div className="grid grid-cols-2 gap-3">
          {[...Array(2)].map((_, i) => (
            <SkeletonCard key={i} padding="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Skeleton className="w-4 h-4 rounded shrink-0" />
                <SkeletonText width={52} height={10} />
              </div>
              <SkeletonText width="70%" height={14} />
            </SkeletonCard>
          ))}
        </div>

        {/* Should return */}
        <SkeletonCard>
          <div className="flex items-center gap-3">
            <Skeleton className="w-9 h-9 rounded-xl shrink-0" />
            <div className="flex flex-col gap-1.5 flex-1">
              <SkeletonText width={56} height={10} />
              <SkeletonText width={88} height={15} />
            </div>
          </div>
        </SkeletonCard>

        {/* Action buttons */}
        <div className="flex gap-3 mt-2">
          <div className="skeleton rounded-xl flex-1 h-12" />
          <div className="skeleton rounded-xl flex-1 h-12" />
        </div>
      </div>
    </div>
  );
}

/** Mirrors the Mensajes chat list */
export function SkeletonMensajesList() {
  return (
    <div className="flex flex-col gap-1">
      {[1, 0.65, 0.35].map((opacity, i) => (
        <div
          key={i}
          className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 shadow-sm border border-[#3C241508]"
          style={{ opacity }}
        >
          <SkeletonAvatar size={48} />
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <SkeletonText width="38%" height={15} />
              <SkeletonText width={32} height={11} />
            </div>
            <SkeletonText width="65%" height={13} />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Mirrors the chat thread loading state */
export function SkeletonChatThread() {
  const bubbles = [
    { fromMe: false, width: "58%" },
    { fromMe: true,  width: "42%" },
    { fromMe: false, width: "72%" },
    { fromMe: true,  width: "35%" },
    { fromMe: true,  width: "55%" },
    { fromMe: false, width: "48%" },
  ];
  return (
    <div className="flex flex-col gap-3 pt-2">
      {/* Day separator */}
      <div className="flex items-center gap-3 my-2">
        <div className="flex-1 h-px bg-[#3C241514]" />
        <Skeleton style={{ width: 40, height: 12 }} className="rounded-full" />
        <div className="flex-1 h-px bg-[#3C241514]" />
      </div>
      {bubbles.map((b, i) => (
        <div key={i} className={`flex ${b.fromMe ? "justify-end" : "justify-start"}`}>
          <div className="flex flex-col gap-1" style={{ width: b.width }}>
            <Skeleton
              className={b.fromMe ? "rounded-2xl rounded-br-sm" : "rounded-2xl rounded-bl-sm"}
              style={{ height: 38 }}
            />
            <Skeleton
              style={{ width: 28, height: 10, alignSelf: b.fromMe ? "flex-end" : "flex-start" }}
              className="rounded-full"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
