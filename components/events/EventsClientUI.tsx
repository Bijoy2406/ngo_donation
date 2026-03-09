"use client";

import { useState, useMemo } from "react";
import EventCard from "@/components/ui/EventCard";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { HiSearch } from "react-icons/hi";
import type { Event } from "@/types";

const EVENTS_PER_PAGE = 6;

interface EventsClientUIProps {
  events: Event[];
}

export default function EventsClientUI({ events }: EventsClientUIProps) {
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(EVENTS_PER_PAGE);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return [...events]
      .sort((a, b) => a.title.localeCompare(b.title))
      .filter((event) =>
        normalizedQuery.length === 0
          ? true
          : event.title.toLowerCase().includes(normalizedQuery)
      );
  }, [events, query]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <div className="max-w-6xl mx-auto px-5 pb-[60px]">
      <div className="mb-6 rounded-[14px] border border-sage-200/80 bg-white/85 p-3 shadow-card">
        <div className="relative">
          <HiSearch
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-sage-500"
          />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setVisibleCount(EVENTS_PER_PAGE);
            }}
            placeholder="Search events by name"
            className="w-full rounded-[10px] border border-sage-200 bg-white pl-10 pr-4 py-2.5 text-sm text-sage-900 placeholder:text-sage-400 outline-none focus:border-sage-400"
          />
        </div>
        <p className="mt-2 px-1 text-xs text-sage-600">
          Showing {Math.min(visible.length, filtered.length)} of {filtered.length} events
        </p>
      </div>

      <div className="flex-1">
        {visible.length === 0 ? (
          <div className="text-center py-16 text-gray-500 text-sm bg-white rounded-[12px] shadow-card">
            No events match that name yet.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {visible.map((event, i) => (
                <ScrollReveal key={event._id} delay={i * 0.06}>
                  <EventCard event={event} />
                </ScrollReveal>
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setVisibleCount((c) => c + EVENTS_PER_PAGE)}
                  className="text-sm font-semibold text-sage-700 border border-sage-200 px-7 py-2.5 rounded-[8px] hover:bg-sage-50 hover:border-sage-400 transition-all duration-200"
                >
                  Show More
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
