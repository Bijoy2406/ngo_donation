import ScrollReveal from "@/components/ui/ScrollReveal";
import EventsClientUI from "@/components/events/EventsClientUI";
import { getAllEvents } from "@/sanity/lib/queries";

export const revalidate = 3600;

export const metadata = {
  title: "Events | Farzana Afroz Foundation",
  description:
    "Browse all events organized by Farzana Afroz Foundation.",
};

export default async function EventsPage() {
  const events = await getAllEvents();

  return (
    <>
      {/* Header */}
      <section className="pt-28 pb-10 bg-sage-50">
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <ScrollReveal>
              <p className="text-xs font-semibold text-sage-500 uppercase tracking-widest mb-2">
                All Events
              </p>
              <h1 className="text-[28px] md:text-[36px] font-bold text-sage-900">
                Events
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={0.1} className="max-w-xs">
              <p className="text-sm text-gray-500 leading-relaxed text-right">
                Explore our past and upcoming events. Filter by category to
                find what matters to you.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Events listing */}
      <section className="pt-8">
        <EventsClientUI events={events} />
      </section>
    </>
  );
}
