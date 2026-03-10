import React from "react";
import { SkeletonCard } from "@/components/ui/SkeletonCard";

export default function EventsLoading() {
  return (
    <>
      <section className="pt-28 pb-10 bg-sage-50">
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="skeleton h-3 w-20 rounded mb-2" />
              <div className="skeleton h-10 w-48 rounded" />
            </div>
            <div className="skeleton h-12 w-full md:max-w-xs rounded" />
          </div>
        </div>
      </section>

      <section className="pt-8">
        <div className="max-w-6xl mx-auto px-5 pb-[60px]">
          <div className="mb-6 rounded-[14px] border border-sage-200/80 bg-white/85 p-3 shadow-card">
            <div className="skeleton h-10 w-full rounded-[10px]" />
            <div className="skeleton h-3 w-32 mt-3 rounded" />
          </div>

          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
