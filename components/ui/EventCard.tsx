import Image from "next/image";
import Link from "next/link";
import { urlFor, getBlurUrl } from "@/sanity/lib/image";
import { formatDate } from "@/lib/utils";
import { richTextToPlainText } from "@/components/ui/RichTextContent";
import type { Event } from "@/types";

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  // Check if image actually contains valid data from sanity or cloudinary
  const hasImage = !!(
    event.thumbnail &&
    ((event.thumbnail._type === "cloudinary.asset" &&
      (event.thumbnail.secure_url || event.thumbnail.url)) ||
      (event.thumbnail._type !== "cloudinary.asset" && event.thumbnail.asset))
  );

  const imageUrl = hasImage
    ? urlFor(event.thumbnail!).width(800).height(450).format("auto").quality("auto:good").url()
    : "";

  const blurUrl = hasImage ? getBlurUrl(event.thumbnail!) : undefined;
  const shortDescription = richTextToPlainText(event.shortDescription);

  return (
    <article className="group bg-white rounded-[8px] shadow-card overflow-hidden hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300 border border-transparent hover:border-sage-200">
      {/* Image Placeholder or Actual Image */}
      <div className="relative aspect-video overflow-hidden image-protected bg-gray-200 flex flex-col items-center justify-center">
        {hasImage ? (
          <Image
            src={imageUrl}
            alt={event.title}
            fill
            placeholder={blurUrl ? "blur" : "empty"}
            blurDataURL={blurUrl}
            className="object-cover group-hover:scale-105 transition-transform duration-500 no-select"
            draggable={false}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400 no-select">
            <span className="font-semibold text-xs tracking-wider uppercase mb-1">Event Image</span>
            <span className="font-bold text-xl tracking-tight">800 x 450</span>
          </div>
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
        {shortDescription && (
          <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">
            {shortDescription}
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
