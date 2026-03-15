import { notFound } from "next/navigation";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { urlFor, getBlurUrl } from "@/sanity/lib/image";
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
    ? urlFor(event.thumbnail).width(1920).height(1080).format("auto").quality("auto:good").url()
    : "/placeholder-landscape.svg";

  const heroBlurUrl = event.thumbnail ? getBlurUrl(event.thumbnail) : undefined;

  return (
    <>
      {/* Hero Image */}
      <section className="relative mt-[84px] md:mt-[92px] aspect-[16/7] max-h-[500px] w-full overflow-hidden image-protected">
        <Image
          src={heroUrl}
          alt={event.title}
          fill
          priority
          placeholder={heroBlurUrl ? "blur" : "empty"}
          blurDataURL={heroBlurUrl}
          className="object-cover no-select"
          draggable={false}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/40" />
      </section>

      <section className="py-8 md:py-10">
        <div className="max-w-6xl mx-auto px-5 w-full text-center">
          <h1 className="text-[22px] md:text-[34px] font-bold text-sage-900 leading-snug max-w-4xl mx-auto no-select">
            {event.title}
          </h1>
          {event.date && (
            <p className="text-sage-700 text-sm mt-3 no-select">
              {formatDate(event.date)}
            </p>
          )}
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
                  .format("auto")
                  .quality("auto:eco")
                  .url();
                const galleryBlur = getBlurUrl(img);
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
                        placeholder={galleryBlur ? "blur" : "empty"}
                        blurDataURL={galleryBlur || undefined}
                        className="w-full h-auto object-cover no-select"
                        draggable={false}
                        loading="lazy"
                        sizes="(max-width: 768px) 100vw, 50vw"
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
