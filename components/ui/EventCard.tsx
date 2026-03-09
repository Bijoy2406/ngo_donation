import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import { formatDate } from "@/lib/utils";
import type { Event } from "@/types";

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const imageUrl = event.thumbnail
    ? urlFor(event.thumbnail).width(800).height(450).format("webp").quality(80).url()
    : "/placeholder-landscape.svg";

  return (
    <article className="group bg-white rounded-[8px] shadow-card overflow-hidden hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300 border border-transparent hover:border-sage-200">
      {/* Image */}
      <div className="relative aspect-video overflow-hidden image-protected">
        <Image
          src={imageUrl}
          alt={event.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500 no-select"
          draggable={false}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {event.category && (
          <span className="absolute top-3 left-3 bg-sage-500/90 text-white text-xs font-medium px-2.5 py-1 rounded-[4px] z-10">
            {event.category}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {event.date && (
          <p className="text-xs text-sage-500 font-medium mb-1.5">
            {formatDate(event.date)}
          </p>
        )}
        <h3 className="text-base font-bold text-sage-900 mb-2 leading-snug line-clamp-2">
          {event.title}
        </h3>
        {event.shortDescription && (
          <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">
            {event.shortDescription}
          </p>
        )}
        <Link
          href={`/events/${event.slug.current}`}
          className="inline-flex items-center text-sm font-semibold text-sage-600 hover:text-sage-800 transition-colors gap-1 group/link"
        >
          Learn More
          <span className="group-hover/link:translate-x-1 transition-transform">
            &rarr;
          </span>
        </Link>
      </div>
    </article>
  );
}
