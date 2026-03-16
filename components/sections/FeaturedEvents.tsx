import Link from "next/link";
import EventCard from "@/components/ui/EventCard";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import type { Event } from "@/types";

interface FeaturedEventsProps {
  events: Event[];
}

export default function FeaturedEvents({ events }: FeaturedEventsProps) {
  return (
    <section id="events" className="py-[60px] bg-white">
      <div className="max-w-6xl mx-auto px-5">
        <ScrollReveal>
          <div className="mb-8 flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-kicker text-sage-600 mb-1">
                Events
              </p>
              <h2 className="text-[32px] md:text-[42px] font-bold text-sage-900 leading-tight">
                Featured <span className="bg-clip-text text-transparent bg-gradient-to-r from-sage-600 to-sage-400">Events</span>
              </h2>
            </div>
            <Link
              href="/events"
              className="inline-flex shrink-0 text-sm font-semibold text-sage-600 transition-colors hover:text-sage-800"
            >
              View All &rarr;
            </Link>
          </div>
        </ScrollReveal>

        {events.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[1, 2].map((i) => (
              <SkeletonCard key={i} aspect="video" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {events.map((event, i) => (
              <ScrollReveal key={event._id} delay={i * 0.1}>
                <EventCard event={event} />
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
