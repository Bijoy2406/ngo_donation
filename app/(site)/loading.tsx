import React from "react";

export default function Loading() {
  return (
    <div className="w-full min-h-screen bg-sage-50/30">
      {/* Hero Skeleton (full height to match typical hero) */}
      <section className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-center bg-gray-100 overflow-hidden">
        <div className="max-w-4xl w-full px-5 text-center flex flex-col items-center z-10 space-y-6">
          <div className="skeleton h-8 w-3/4 max-w-lg rounded-full" />
          <div className="skeleton h-12 w-full max-w-3xl rounded-lg" />
          <div className="skeleton h-12 w-5/6 max-w-2xl rounded-lg" />
          <div className="skeleton h-4 w-2/3 max-w-md mt-6 rounded-full" />
          <div className="skeleton h-4 w-1/2 max-w-sm rounded-full" />
          <div className="flex gap-4 mt-8">
            <div className="skeleton h-12 w-32 rounded-full" />
            <div className="skeleton h-12 w-32 rounded-full" />
          </div>
        </div>
      </section>

      {/* About Section Skeleton */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="w-full md:w-1/2 space-y-4">
              <div className="skeleton h-4 w-24 rounded" />
              <div className="skeleton h-10 w-3/4 rounded" />
              <div className="skeleton h-4 w-full rounded mt-6" />
              <div className="skeleton h-4 w-full rounded" />
              <div className="skeleton h-4 w-5/6 rounded" />
              <div className="skeleton h-12 w-40 rounded-full mt-8" />
            </div>
            <div className="w-full md:w-1/2">
              <div className="skeleton w-full aspect-[4/3] rounded-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items Skeleton */}
      <section className="py-24 bg-sage-50">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-16 flex flex-col items-center space-y-4">
            <div className="skeleton h-4 w-32 rounded" />
            <div className="skeleton h-10 w-64 rounded" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm">
                <div className="skeleton w-full aspect-video" />
                <div className="p-6 space-y-3">
                  <div className="skeleton h-6 w-3/4 rounded" />
                  <div className="skeleton h-4 w-full rounded" />
                  <div className="skeleton h-4 w-5/6 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
