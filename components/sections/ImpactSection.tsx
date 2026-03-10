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
            <p className="section-kicker text-sage-600 mb-1 justify-center">
              Impact
            </p>
            <h2 className="text-[32px] md:text-[42px] font-bold text-sage-900 leading-tight">
              Our Impact <span className="bg-clip-text text-transparent bg-gradient-to-r from-sage-600 to-sage-400">Areas</span>
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 mt-6 md:mt-10">
          {displayItems.map((item, i) => {
            const stepNumber = String(i + 1).padStart(2, "0");
            return (
              <ScrollReveal key={item._id} delay={i * 0.08}>
                <div className="relative bg-sage-50 rounded-[12px] p-6 lg:p-7 pt-10 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-sage-200 h-full flex flex-col group">
                  <div className="absolute -top-5 left-6 bg-gradient-to-br from-sage-400 to-sage-600 text-white text-[15px] font-bold w-[46px] h-[40px] rounded-[12px] flex items-center justify-center transform group-hover:scale-110 group-hover:-translate-y-1 transition-transform duration-300">
                    {stepNumber}
                  </div>

                  <h3 className="font-bold text-sage-900 text-[18px] mb-3 leading-snug">
                    {item.heading}
                  </h3>
                  <p className="text-[14px] md:text-[15px] text-gray-600 leading-[1.7]">
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
