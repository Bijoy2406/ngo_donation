"use client";

import { useState, useMemo } from "react";
import EventCard from "@/components/ui/EventCard";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { HiSearch } from "react-icons/hi";
import type { Event } from "@/types";

const EVENTS_PER_PAGE = 6;

interface EventsClientUIProps {
  events: Event[];
  ongoingEvents: Event[];
}

export default function EventsClientUI({ events, ongoingEvents }: EventsClientUIProps) {
  const [tab, setTab] = useState<"past" | "ongoing">("past");
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(EVENTS_PER_PAGE);

  const source = tab === "past" ? events : ongoingEvents;

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return source
      .toSorted((a, b) => a.title.localeCompare(b.title))
      .filter((event) =>
        normalizedQuery.length === 0
          ? true
          : event.title.toLowerCase().includes(normalizedQuery)
      );
  }, [source, query]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const handleTabChange = (next: "past" | "ongoing") => {
    setTab(next);
    setQuery("");
    setVisibleCount(EVENTS_PER_PAGE);
  };

  return (
    <div className="max-w-6xl mx-auto px-5 pb-[60px]">
      {/* Tab toggle */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-sage-100 rounded-full p-1 gap-1">
          <button
            type="button"
            onClick={() => handleTabChange("past")}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
              tab === "past"
                ? "bg-sage-600 text-white shadow-sm"
                : "text-sage-600 hover:text-sage-800"
            }`}
          >
            Events
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("ongoing")}
            className={`relative px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
              tab === "ongoing"
                ? "bg-sage-600 text-white shadow-sm"
                : "text-sage-600 hover:text-sage-800"
            }`}
          >
            Ongoing
            {ongoingEvents.length > 0 && (
              <span
                className={`absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center transition-colors duration-200 ${
                  tab === "ongoing"
                    ? "bg-white text-sage-700"
                    : "bg-sage-500 text-white"
                }`}
              >
                {ongoingEvents.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6 rounded-[14px] border border-sage-200/80 bg-white/85 p-3 shadow-card">
        <div className="relative">
          <HiSearch
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-sage-500"
            aria-hidden="true"
          />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setVisibleCount(EVENTS_PER_PAGE);
            }}
            placeholder={`Search ${tab === "ongoing" ? "ongoing " : ""}events by name`}
            aria-label={`Search ${tab === "ongoing" ? "ongoing " : ""}events by name`}
            className="w-full rounded-[10px] border border-sage-200 bg-white pl-10 pr-4 py-2.5 text-sm text-sage-900 placeholder:text-sage-400 outline-none focus:border-sage-400"
          />
        </div>
        <p className="mt-2 px-1 text-xs text-sage-600">
          Showing {Math.min(visible.length, filtered.length)} of {filtered.length}{" "}
          {tab === "ongoing" ? "ongoing " : ""}event{filtered.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Grid */}
      <div className="flex-1">
        {visible.length === 0 ? (
          <div className="text-center py-16 text-gray-500 text-sm bg-white rounded-[12px] shadow-card">
            {tab === "ongoing"
              ? "No ongoing events at the moment."
              : "No events match that name yet."}
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
                  type="button"
                  onClick={() => setVisibleCount((c) => c + EVENTS_PER_PAGE)}
                  className="text-sm font-semibold text-sage-700 border border-sage-200 px-7 py-2.5 rounded-[8px] hover:bg-sage-50 hover:border-sage-400 transition-all duration-200 cursor-pointer"
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
