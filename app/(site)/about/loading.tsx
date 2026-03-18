export default function AboutLoading() {
  return (
    <>
      <section className="pt-28 pb-10 bg-sage-50">
        <div className="max-w-6xl mx-auto px-5">
          <div className="skeleton h-3 w-20 rounded mb-2" />
          <div className="skeleton h-10 w-full max-w-2xl rounded" />
        </div>
      </section>

      <section className="pb-8 bg-white">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
            <div className="lg:col-span-8 rounded-[14px] border border-sage-100 bg-white shadow-card p-6 md:p-8">
              <div className="skeleton h-3 w-28 rounded mb-4" />
              <div className="space-y-3">
                <div className="skeleton h-4 w-full rounded" />
                <div className="skeleton h-4 w-[95%] rounded" />
                <div className="skeleton h-4 w-[90%] rounded" />
                <div className="skeleton h-4 w-[86%] rounded" />
              </div>
              <div className="mt-6 flex gap-3">
                <div className="skeleton h-10 w-36 rounded-[8px]" />
                <div className="skeleton h-10 w-32 rounded-[8px]" />
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="rounded-[14px] border border-sage-100 bg-sage-50 p-5 md:p-6 space-y-5">
                <div className="skeleton h-3 w-40 rounded" />
                <div className="skeleton h-16 w-full rounded" />
                <div className="skeleton h-16 w-full rounded" />
                <div className="skeleton h-16 w-full rounded" />
              </div>
              <div className="rounded-[14px] border border-sage-100 bg-white p-5 md:p-6">
                <div className="skeleton h-4 w-28 rounded mb-2" />
                <div className="skeleton h-4 w-full rounded" />
                <div className="skeleton h-4 w-[80%] rounded mt-2" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
