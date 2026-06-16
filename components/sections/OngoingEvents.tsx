import Link from "next/link";
import EventCard from "@/components/ui/EventCard";
import ScrollReveal from "@/components/ui/ScrollReveal";
import type { Event } from "@/types";

interface OngoingEventsProps {
  events: Event[];
}

export default function OngoingEvents({ events }: OngoingEventsProps) {
  if (!events || events.length === 0) return null;

  return (
    <section id="ongoing-events" className="py-[60px] bg-sage-50">
      <div className="max-w-6xl mx-auto px-5">
        <ScrollReveal>
          <div className="mb-8 flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-kicker text-sage-600 mb-1">Live Now</p>
              <h2 className="text-[32px] md:text-[42px] font-bold text-sage-900 leading-tight">
                Ongoing{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-sage-600 to-sage-400">
                  Events
                </span>
              </h2>
            </div>
            <Link
              href="/events?tab=ongoing"
              className="inline-flex shrink-0 text-sm font-semibold text-sage-600 transition-colors hover:text-sage-800"
            >
              View All &rarr;
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {events.map((event, i) => (
            <ScrollReveal key={event._id} delay={i * 0.1}>
              <div className="relative">
                <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 bg-sage-500 text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse inline-block" />
                  Ongoing
                </span>
                <EventCard event={event} />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
