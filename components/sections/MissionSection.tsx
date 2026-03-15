import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { urlFor, getBlurUrl } from "@/sanity/lib/image";
import ScrollReveal from "@/components/ui/ScrollReveal";
import type { MissionSection } from "@/types";

interface MissionSectionProps {
  mission: MissionSection | null;
}

export default function MissionSectionComp({ mission }: MissionSectionProps) {
  const hasImage = !!mission?.image;
  const imageUrl = hasImage
    ? urlFor(mission!.image!).width(600).height(600).format("auto").quality("auto:good").url()
    : "";
  const blurUrl = hasImage ? getBlurUrl(mission!.image!) : undefined;

  const heading = mission?.heading ?? "Our Mission";
  const hasDescription = mission?.description && mission.description.length > 0;

  return (
    <section id="mission" className="scroll-mt-28 py-[60px] bg-sage-50">
      <div className="max-w-6xl mx-auto px-5">
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-center">
          {/* Image */}
          <ScrollReveal direction="right" className="w-full md:w-[40%] shrink-0">
            <div className="relative aspect-square rounded-[8px] overflow-hidden image-protected shadow-card bg-gray-200 flex items-center justify-center">
              {hasImage ? (
                <Image
                  src={imageUrl}
                  alt="Our Mission"
                  fill
                  placeholder={blurUrl ? "blur" : "empty"}
                  blurDataURL={blurUrl}
                  className="object-cover no-select"
                  draggable={false}
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              ) : (
                <span className="text-gray-400 font-bold text-2xl no-select">600 x 600</span>
              )}
            </div>
          </ScrollReveal>

          {/* Text */}
          <ScrollReveal direction="left" delay={0.1} className="flex-1">
            <p className="section-kicker text-sage-600 mb-1">
              Mission
            </p>
            <h2 className="text-[32px] md:text-[42px] font-bold text-sage-900 leading-tight">
              Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-sage-600 to-sage-400">Mission</span>
            </h2>
            {hasDescription ? (
              <div className="prose-content">
                <PortableText value={mission!.description} />
              </div>
            ) : (
      <p className="text-gray-600 leading-relaxed text-[14px] md:text-[15px]">
        To build a compassionate society where every vulnerable individual
        receives the support, dignity, and opportunities needed to live a
        better life. Our mission is to support communities by providing
        humanitarian assistance, emergency relief, educational support for
        children, and essential seasonal aid such as winter clothing and 
        Ramadan iftar for those in need.
      </p>
            )}
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}