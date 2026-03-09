export function SkeletonCard({ aspect = "video" }: { aspect?: "video" | "square" }) {
  return (
    <div className="rounded-[8px] overflow-hidden shadow-card">
      <div
        className={`skeleton w-full ${
          aspect === "square" ? "aspect-square" : "aspect-video"
        }`}
      />
      <div className="p-4 bg-white space-y-2.5">
        <div className="skeleton h-4 rounded w-3/4" />
        <div className="skeleton h-3 rounded w-full" />
        <div className="skeleton h-3 rounded w-5/6" />
      </div>
    </div>
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`skeleton h-3 rounded ${i === lines - 1 ? "w-2/3" : "w-full"}`}
        />
      ))}
    </div>
  );
}
