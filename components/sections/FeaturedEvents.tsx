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
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold text-sage-500 uppercase tracking-widest mb-1">
                Events
              </p>
              <h2 className="text-[22px] md:text-[26px] font-bold text-sage-900">
                Featured Events
              </h2>
            </div>
            <Link
              href="/events"
              className="text-sm font-semibold text-sage-600 hover:text-sage-800 transition-colors"
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
