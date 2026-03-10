import React from "react";

export default function EventDetailLoading() {
  return (
    <>
      {/* Hero Image Skeleton */}
      <section className="relative pt-[60px] aspect-[16/7] max-h-[500px] overflow-hidden bg-gray-200 skeleton">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-6xl mx-auto px-5 pb-8 w-full space-y-3 shadow-sm">
            <div className="skeleton h-8 md:h-10 w-3/4 max-w-2xl rounded" />
            <div className="skeleton h-4 w-32 rounded" />
          </div>
        </div>
      </section>

      {/* Content Skeleton */}
      <section className="py-[60px]">
        <div className="max-w-3xl mx-auto px-5">
          <div className="space-y-4">
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-4 w-[90%] rounded" />
            <div className="skeleton h-4 w-[95%] rounded" />
            <div className="skeleton h-4 w-[80%] rounded" />
            <div className="skeleton h-4 w-full rounded pt-4 mt-6" />
            <div className="skeleton h-4 w-[85%] rounded" />
            <div className="skeleton h-4 w-[60%] rounded" />
          </div>
        </div>
      </section>

      {/* Gallery Skeleton */}
      <section className="pb-[60px]">
        <div className="max-w-6xl mx-auto px-5">
          <div className="skeleton h-6 w-40 rounded mb-6" />

          <div className="masonry-grid">
            {/* Masonry layout needs varying heights to look right. 
              Since this is generic skeleton, we provide typical aspect ratios. */}
            <div className="masonry-item skeleton rounded-[8px] h-[300px]" />
            <div className="masonry-item skeleton rounded-[8px] h-[200px]" />
            <div className="masonry-item skeleton rounded-[8px] h-[400px]" />
            <div className="masonry-item skeleton rounded-[8px] h-[250px]" />
            <div className="masonry-item skeleton rounded-[8px] h-[350px]" />
          </div>
        </div>
      </section>
    </>
  );
}
