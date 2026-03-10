import React from "react";
import { SkeletonCard } from "@/components/ui/SkeletonCard";

export default function TeamLoading() {
  return (
    <>
      {/* Hero */}
      <section className="pt-28 pb-12 bg-sage-50">
        <div className="max-w-6xl mx-auto px-5">
          <div className="skeleton h-3 w-16 rounded mb-2" />
          <div className="skeleton h-10 w-40 rounded" />
          <div className="skeleton h-4 w-full max-w-xl rounded mt-4" />
          <div className="skeleton h-4 w-5/6 max-w-lg rounded mt-2" />
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-[60px] bg-white">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <SkeletonCard key={i} aspect="square" />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
