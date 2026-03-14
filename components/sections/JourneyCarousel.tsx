"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { urlFor, getBlurUrl } from "@/sanity/lib/image";
import ScrollReveal from "@/components/ui/ScrollReveal";
import type { CarouselItem } from "@/types";

interface JourneyCarouselProps {
  items: CarouselItem[];
}

const placeholderItems = [
  { _id: "p1", heading: "Our Journey", subheading: "A milestone moment", order: 1 },
  { _id: "p2", heading: "Community Work", subheading: "Reaching new heights", order: 2 },
  { _id: "p3", heading: "Making Impact", subheading: "Together we grow", order: 3 },
  { _id: "p4", heading: "Growth & Change", subheading: "Every step forward", order: 4 },
];

export default function JourneyCarousel({ items }: JourneyCarouselProps) {
  const displayItems =
    items.length > 0
      ? items
      : (placeholderItems as unknown as CarouselItem[]);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum swipe distance (in pixels) to trigger a slide change
  const minSwipeDistance = 50;

  const nextEvent = useCallback(() => {
    setCurrentIdx((i) => (displayItems.length ? (i + 1) % displayItems.length : 0));
  }, [displayItems.length]);

  const prevEvent = useCallback(() => {
    setCurrentIdx((i) =>
      displayItems.length ? (i - 1 + displayItems.length) % displayItems.length : 0
    );
  }, [displayItems.length]);

  useEffect(() => {
    if (isPaused || touchStart !== null) return;
    if (displayItems.length < 2) return;
    const id = setInterval(() => {
      nextEvent();
    }, 5500); // Autoplay 5.5s
    return () => clearInterval(id);
  }, [displayItems.length, isPaused, nextEvent]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!displayItems.length) return;
      if (e.key === "ArrowRight") nextEvent();
      if (e.key === "ArrowLeft") prevEvent();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [displayItems.length, nextEvent, prevEvent]);

  // Touch handlers for swipe support
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextEvent();
    }
    if (isRightSwipe) {
      prevEvent();
    }
    
    // Reset touch variables
    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <section className="py-[80px] bg-sage-50 relative overflow-hidden">
      {/* Decorative Orbs (adapted from original code) */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-[#c5d8c8]/40 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-0 -left-20 h-80 w-80 rounded-full bg-[#9abfa0]/30 blur-3xl" aria-hidden="true" />

      <div className="relative z-10 max-w-6xl mx-auto px-5 w-full single-mode">
        <ScrollReveal>
          <header className="mb-8">
            <p className="section-kicker text-sage-600 mb-2">
              Gallery
            </p>
            <h2 className="text-[32px] md:text-[42px] font-bold text-sage-900 leading-tight">
              Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-sage-600 to-sage-400">Journey</span>
            </h2>
            <p className="text-sage-700 mt-2 text-base max-w-lg">
              Hover over the image to pause the slideshow. Navigate through our moments using the arrows.
            </p>
          </header>
        </ScrollReveal>

        {/* Spotlight Carousel Wrapper */}
        <ScrollReveal>
          <div
            className="group relative w-full aspect-[4/3] md:aspect-[21/9] rounded-[24px] overflow-hidden shadow-2xl bg-sage-200"
            role="region"
            aria-label="Journey Image Carousel"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocus={() => setIsPaused(true)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                setIsPaused(false);
              }
            }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {displayItems.map((item, i) => {
              // Virtualize: only render current, previous, and next slides
              const len = displayItems.length;
              const prev = (currentIdx - 1 + len) % len;
              const next = (currentIdx + 1) % len;
              const isVisible = i === currentIdx || i === prev || i === next;
              if (!isVisible && len > 3) return null;

              const active = i === currentIdx;
              const hasImage = !!item.image;
              const imageUrl = hasImage
                ? urlFor(item.image!).width(1600).height(800).format("auto").quality("auto:good").url()
                : "";
              const blurUrl = hasImage ? getBlurUrl(item.image!) : undefined;

              return (
                <div
                  key={item._id}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    active ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
                  }`}
                  aria-hidden={!active}
                >
                  {/* Background Image with slow zoom effect when active */}
                  {hasImage ? (
                    <Image
                      src={imageUrl}
                      alt={item.heading}
                      fill
                      priority={i === 0}
                      placeholder={blurUrl ? "blur" : "empty"}
                      blurDataURL={blurUrl}
                      className={`object-cover transition-transform duration-[8s] ease-out ${
                        active ? "scale-105" : "scale-100"
                      }`}
                      sizes="(max-width: 1024px) 100vw, 1200px"
                    />
                  ) : (
                    <div className={`absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-400 font-bold text-4xl md:text-5xl no-select transition-transform duration-[8s] ease-out ${active ? "scale-105" : "scale-100"}`}>
                      1600 x 800
                    </div>
                  )}
                  
                  {/* Dark Gradient Overlay for text readability */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 ${
                    active ? "opacity-0 group-hover:opacity-100" : "opacity-0"
                  }`} />

                  {/* Text Details Overlay */}
                  <div 
                    className={`absolute inset-x-0 bottom-0 p-6 md:p-12 flex flex-col justify-end transform transition-all duration-500 ease-out ${
                      active ? "translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100" : "translate-y-8 opacity-0"
                    }`}
                  >
                    <div className="max-w-2xl">
                      <h3 className="text-3xl md:text-5xl font-bold text-white mb-3 tracking-tight [text-shadow:_0_2px_10px_rgb(0_0_0_/_40%)]">
                        {item.heading}
                      </h3>
                      {item.subheading && (
                        <p className="text-white/90 text-lg md:text-xl font-medium leading-relaxed [text-shadow:_0_1px_5px_rgb(0_0_0_/_40%)]">
                          {item.subheading}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Arrow Controls (Sides) */}
            <button
              aria-label="Previous slide"
              onClick={(e) => {
                e.preventDefault();
                prevEvent();
              }}
              disabled={displayItems.length < 2}
              className="hidden lg:flex absolute left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full border border-gray-500/40 bg-gray-800/60 backdrop-blur-md shadow-lg items-center justify-center text-white hover:bg-sage-600 hover:border-sage-600 transition-all duration-300 disabled:opacity-50 opacity-0 group-hover:opacity-100"
            >
              <HiChevronLeft size={24} />
            </button>

            <button
              aria-label="Next slide"
              onClick={(e) => {
                e.preventDefault();
                nextEvent();
              }}
              disabled={displayItems.length < 2}
              className="hidden lg:flex absolute right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full border border-gray-500/40 bg-gray-800/60 backdrop-blur-md shadow-lg items-center justify-center text-white hover:bg-sage-600 hover:border-sage-600 transition-all duration-300 disabled:opacity-50 opacity-0 group-hover:opacity-100"
            >
              <HiChevronRight size={24} />
            </button>
          </div>
        </ScrollReveal>

        {/* Dot Indicators */}
        <div className="flex justify-center gap-2.5 mt-8">
          {displayItems.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIdx(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentIdx
                  ? "bg-sage-600 w-8"
                  : "bg-sage-300 w-2.5 hover:bg-sage-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
