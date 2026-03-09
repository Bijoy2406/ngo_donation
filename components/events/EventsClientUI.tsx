"use client";

import { useState, useMemo } from "react";
import EventCard from "@/components/ui/EventCard";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { HiChevronDown } from "react-icons/hi";
import type { Event } from "@/types";

const EVENTS_PER_PAGE = 6;

const CATEGORIES = [
  "All",
  "Education",
  "Health",
  "Environment",
  "Community",
  "Awareness",
  "Relief",
  "Other",
];

interface EventsClientUIProps {
  events: Event[];
}

export default function EventsClientUI({ events }: EventsClientUIProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(EVENTS_PER_PAGE);
  const [showAllCategories, setShowAllCategories] = useState(false);

  const filtered = useMemo(() => {
    if (activeCategory === "All") return events;
    return events.filter((e) => e.category === activeCategory);
  }, [events, activeCategory]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const displayCategories = showAllCategories
    ? CATEGORIES
    : CATEGORIES.slice(0, 6);

  return (
    <div className="max-w-6xl mx-auto px-5 pb-[60px]">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="md:w-48 shrink-0">
          <div className="sticky top-20">
            <p className="text-xs font-semibold text-sage-600 uppercase tracking-widest mb-3">
              Filter
            </p>
            <ul className="space-y-1">
              {displayCategories.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      setActiveCategory(cat);
                      setVisibleCount(EVENTS_PER_PAGE);
                    }}
                    className={`w-full text-left text-sm px-3 py-2 rounded-[8px] transition-all duration-200 font-medium ${
                      activeCategory === cat
                        ? "bg-sage-500 text-white"
                        : "text-gray-600 hover:bg-sage-50 hover:text-sage-800"
                    }`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
            {CATEGORIES.length > 6 && (
              <button
                onClick={() => setShowAllCategories(!showAllCategories)}
                className="mt-2 text-xs text-sage-500 hover:text-sage-700 flex items-center gap-1 px-3"
              >
                {showAllCategories ? "Show less" : "See more"}
                <HiChevronDown
                  size={12}
                  className={showAllCategories ? "rotate-180" : ""}
                />
              </button>
            )}
          </div>
        </aside>

        {/* Event Grid */}
        <div className="flex-1">
          {visible.length === 0 ? (
            <div className="text-center py-16 text-gray-400 text-sm">
              No events found in this category.
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
                    onClick={() =>
                      setVisibleCount((c) => c + EVENTS_PER_PAGE)
                    }
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
    </div>
  );
}
