import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import type { TeamMember } from "@/types";

interface TeamCardProps {
  member: TeamMember;
}

export default function TeamCard({ member }: TeamCardProps) {
  const imageUrl = member.image
    ? urlFor(member.image).width(400).height(400).format("webp").quality(80).url()
    : "/placeholder-square.svg";

  return (
    <div className="group bg-white rounded-[8px] shadow-card overflow-hidden hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300 border border-transparent hover:border-sage-200">
      <div className="relative aspect-square overflow-hidden image-protected">
        <Image
          src={imageUrl}
          alt={member.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500 no-select"
          draggable={false}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>
      <div className="p-4 text-center">
        <h3 className="font-bold text-sage-900 text-base leading-snug">
          {member.name}
        </h3>
        <p className="text-sm text-sage-500 mt-0.5">{member.role}</p>
      </div>
    </div>
  );
}
