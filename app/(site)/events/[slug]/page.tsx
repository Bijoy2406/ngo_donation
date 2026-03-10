import { notFound } from "next/navigation";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { urlFor } from "@/sanity/lib/image";
import { getEventBySlug, getAllEvents } from "@/sanity/lib/queries";
import { formatDate, simulateDelay } from "@/lib/utils";
import ScrollReveal from "@/components/ui/ScrollReveal";

export const revalidate = 3600;

export async function generateStaticParams() {
  const events = await getAllEvents();
  return events.map((e) => ({ slug: e.slug.current }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return {};
  return {
    title: `${event.title} | Farzana Afroz Foundation`,
    description: event.shortDescription,
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await simulateDelay();
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) notFound();

  const heroUrl = event.thumbnail
    ? urlFor(event.thumbnail).width(1920).height(1080).format("webp").quality(80).url()
    : "/placeholder-landscape.svg";

  return (
    <>
      {/* Hero Image */}
      <section className="relative pt-[60px] aspect-[16/7] max-h-[500px] overflow-hidden image-protected">
        <Image
          src={heroUrl}
          alt={event.title}
          fill
          priority
          className="object-cover no-select"
          draggable={false}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-6xl mx-auto px-5 pb-8 w-full">
            <h1 className="text-[22px] md:text-[34px] font-bold text-white leading-snug max-w-2xl no-select">
              {event.title}
            </h1>
            {event.date && (
              <p className="text-white/70 text-sm mt-2 no-select">
                {formatDate(event.date)}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-[60px]">
        <div className="max-w-3xl mx-auto px-5">
          <ScrollReveal>
            {event.description && event.description.length > 0 ? (
              <div className="prose-content">
                <PortableText value={event.description} />
              </div>
            ) : event.shortDescription ? (
              <p className="text-gray-600 leading-relaxed text-[15px]">
                {event.shortDescription}
              </p>
            ) : null}
          </ScrollReveal>
        </div>
      </section>

      {/* Gallery */}
      {event.gallery && event.gallery.length > 0 && (
        <section className="pb-[60px]">
          <div className="max-w-6xl mx-auto px-5">
            <ScrollReveal>
              <h2 className="text-[18px] font-bold text-sage-900 mb-6">
                Event Gallery
              </h2>
            </ScrollReveal>

            <div className="masonry-grid">
              {event.gallery.map((img, i) => {
                const src = urlFor(img)
                  .width(800)
                  .format("webp")
                  .quality(75)
                  .url();
                return (
                  <ScrollReveal
                    key={i}
                    delay={i * 0.04}
                    className="masonry-item"
                  >
                    <div className="relative overflow-hidden rounded-[8px] image-protected">
                      <Image
                        src={src}
                        alt={`Gallery image ${i + 1}`}
                        width={800}
                        height={600}
                        className="w-full h-auto object-cover no-select"
                        draggable={false}
                        loading="lazy"
                      />
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
