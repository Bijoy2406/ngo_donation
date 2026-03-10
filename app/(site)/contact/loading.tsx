import React from "react";

export default function ContactLoading() {
  return (
    <>
      {/* Header Skeleton */}
      <section className="pt-28 pb-12 bg-sage-50">
        <div className="max-w-6xl mx-auto px-5">
          <div className="skeleton h-3 w-16 rounded mb-2" />
          <div className="skeleton h-10 w-48 rounded" />
          <div className="skeleton h-4 w-full max-w-xl rounded mt-4" />
          <div className="skeleton h-4 w-5/6 max-w-lg rounded mt-2" />
        </div>
      </section>

      {/* Contact Content Skeleton */}
      <section className="py-[60px] bg-white">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-16">
            {/* Info Skeleton md:col-span-2 */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <div className="skeleton h-3 w-24 rounded mb-4" />
                <ul className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <div className="skeleton h-4 w-4 rounded-full mt-0.5 shrink-0" />
                      <div className="skeleton h-4 w-3/4 rounded" />
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Form Skeleton md:col-span-3 */}
            <div className="md:col-span-3">
              <div className="space-y-5">
                {[1, 2].map((i) => (
                  <div key={i}>
                    <div className="skeleton h-4 w-24 rounded mb-1.5" />
                    <div className="skeleton h-[46px] w-full rounded-[8px]" />
                  </div>
                ))}
                
                {/* Textarea */}
                <div>
                  <div className="skeleton h-4 w-24 rounded mb-1.5" />
                  <div className="skeleton h-[130px] w-full rounded-[8px]" />
                </div>

                {/* Submit button */}
                <div className="skeleton h-[44px] w-40 rounded-[8px]" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
