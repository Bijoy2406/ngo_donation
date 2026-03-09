import ScrollReveal from "@/components/ui/ScrollReveal";
import type { ImpactItem } from "@/types";
import {
  HiHeart,
  HiUserGroup,
  HiGlobe,
  HiAcademicCap,
  HiLightBulb,
  HiStar,
} from "react-icons/hi";
import { FaHandsHelping, FaLeaf } from "react-icons/fa";

interface ImpactSectionProps {
  items: ImpactItem[];
}

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  heart: HiHeart,
  users: HiUserGroup,
  globe: HiGlobe,
  education: HiAcademicCap,
  lightbulb: HiLightBulb,
  star: HiStar,
  hands: FaHandsHelping,
  leaf: FaLeaf,
};

const defaultItems: ImpactItem[] = [
  {
    _id: "d1",
    icon: "education",
    heading: "Education Access",
    description:
      "Providing scholarships and learning resources to students who cannot afford quality education.",
    order: 1,
  },
  {
    _id: "d2",
    icon: "heart",
    heading: "Healthcare Support",
    description:
      "Organizing free health camps and connecting communities with essential medical services.",
    order: 2,
  },
  {
    _id: "d3",
    icon: "users",
    heading: "Community Building",
    description:
      "Creating sustainable programs that strengthen social bonds and promote collective growth.",
    order: 3,
  },
  {
    _id: "d4",
    icon: "leaf",
    heading: "Environmental Action",
    description:
      "Promoting clean environments through awareness campaigns and community-led initiatives.",
    order: 4,
  },
];

export default function ImpactSection({ items }: ImpactSectionProps) {
  const displayItems = items.length > 0 ? items : defaultItems;

  return (
    <section className="py-[60px] bg-white">
      <div className="max-w-6xl mx-auto px-5">
        <ScrollReveal>
          <div className="text-center mb-10">
            <p className="text-xs font-semibold text-sage-500 uppercase tracking-widest mb-1">
              Impact
            </p>
            <h2 className="text-[22px] md:text-[26px] font-bold text-sage-900">
              Our Impact Areas
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {displayItems.map((item, i) => {
            const Icon = iconMap[item.icon] ?? HiHeart;
            return (
              <ScrollReveal key={item._id} delay={i * 0.08}>
                <div className="bg-sage-50 rounded-[8px] p-6 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-sage-200">
                  <div className="w-10 h-10 bg-sage-500/10 rounded-[8px] flex items-center justify-center mb-4">
                    <Icon size={20} className="text-sage-600" />
                  </div>
                  <h3 className="font-bold text-sage-900 text-base mb-2">
                    {item.heading}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
