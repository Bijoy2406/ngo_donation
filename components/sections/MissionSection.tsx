import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { urlFor } from "@/sanity/lib/image";
import ScrollReveal from "@/components/ui/ScrollReveal";
import type { MissionSection } from "@/types";

interface MissionSectionProps {
  mission: MissionSection | null;
}

export default function MissionSectionComp({ mission }: MissionSectionProps) {
  const imageUrl = mission?.image
    ? urlFor(mission.image).width(600).height(600).format("webp").quality(80).url()
    : "/placeholder-square.svg";

  const heading = mission?.heading ?? "Our Mission";
  const hasDescription = mission?.description && mission.description.length > 0;

  return (
    <section id="mission" className="py-[60px] bg-sage-50">
      <div className="max-w-6xl mx-auto px-5">
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-center">
          {/* Image */}
          <ScrollReveal direction="right" className="w-full md:w-[40%] shrink-0">
            <div className="relative aspect-square rounded-[8px] overflow-hidden image-protected shadow-card">
              <Image
                src={imageUrl}
                alt="Our Mission"
                fill
                className="object-cover no-select"
                draggable={false}
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>
          </ScrollReveal>

          {/* Text */}
          <ScrollReveal direction="left" delay={0.1} className="flex-1">
            <p className="text-xs font-semibold text-sage-500 uppercase tracking-widest mb-2">
              Mission
            </p>
            <h2 className="text-[22px] md:text-[26px] font-bold text-sage-900 mb-5">
              {heading}
            </h2>
            {hasDescription ? (
              <div className="prose-content">
                <PortableText value={mission!.description} />
              </div>
            ) : (
              <p className="text-gray-600 leading-relaxed text-[14px] md:text-[15px]">
                Our mission is to empower underprivileged communities by
                providing access to quality education, healthcare services,
                and economic opportunities. We strive to build a more
                equitable and compassionate society where every individual
                has the resources they need to thrive.
              </p>
            )}
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
