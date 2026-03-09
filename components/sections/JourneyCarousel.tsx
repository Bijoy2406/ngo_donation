"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { urlFor } from "@/sanity/lib/image";
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

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onInit = useCallback(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onInit();
    onSelect();
    emblaApi.on("reInit", onInit);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onInit, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="py-[60px] bg-sage-50">
      <div className="max-w-6xl mx-auto px-5">
        <ScrollReveal>
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="section-kicker text-sage-600 mb-1">
                Gallery
              </p>
              <h2 className="text-[22px] md:text-[26px] font-bold text-sage-900">
                Our Journey
              </h2>
            </div>
            {/* Arrow Controls */}
            <div className="flex gap-2">
              <button
                onClick={scrollPrev}
                aria-label="Previous slide"
                className="w-10 h-10 rounded-[8px] border border-sage-200 flex items-center justify-center text-sage-700 hover:bg-sage-500 hover:text-white hover:border-sage-500 transition-all duration-200"
              >
                <HiChevronLeft size={20} />
              </button>
              <button
                onClick={scrollNext}
                aria-label="Next slide"
                className="w-10 h-10 rounded-[8px] border border-sage-200 flex items-center justify-center text-sage-700 hover:bg-sage-500 hover:text-white hover:border-sage-500 transition-all duration-200"
              >
                <HiChevronRight size={20} />
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4">
            {displayItems.map((item) => {
              const imageUrl = item.image
                ? urlFor(item.image).width(900).height(506).format("webp").quality(80).url()
                : "/placeholder-landscape.svg";

              return (
                <div
                  key={item._id}
                  className="flex-none w-[85%] sm:w-[55%] md:w-[40%] lg:w-[32%]"
                >
                  <div className="relative aspect-video rounded-[8px] overflow-hidden group cursor-default image-protected">
                    <Image
                      src={imageUrl}
                      alt={item.heading}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500 no-select"
                      draggable={false}
                      sizes="(max-width: 640px) 85vw, (max-width: 1024px) 40vw, 32vw"
                    />
                    {/* Overlay — visible on hover / tap */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                      <h3 className="text-white font-bold text-base leading-snug no-select">
                        {item.heading}
                      </h3>
                      {item.subheading && (
                        <p className="text-white/80 text-sm mt-0.5 no-select">
                          {item.subheading}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dot Indicators */}
        <div className="flex justify-center gap-2 mt-5">
          {scrollSnaps.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === selectedIndex
                  ? "bg-sage-500 w-6"
                  : "bg-sage-200 w-2 hover:bg-sage-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
