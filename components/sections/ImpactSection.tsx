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
    icon: "hands",
    heading: "Construction of homes for families without proper shelter",
    description: "Construction of homes for families without proper shelter",
    order: 1,
  },
  {
    _id: "d2",
    icon: "education",
    heading: "Distribution of iftar meals during Ramadan to underprivileged communities",
    description: "Distribution of iftar meals during Ramadan to underprivileged communities",
    order: 2,
  },
  {
    _id: "d3",
    icon: "star",
    heading: "Flood relief support for disaster-affected families",
    description: "Flood relief support for disaster-affected families",
    order: 3,
  },
  {
    _id: "d4",
    icon: "leaf",
    heading: "Winter clothing distribution for vulnerable populations",
    description: "Winter clothing distribution for vulnerable populations",
    order: 4,
  },
  {
    _id: "d5",
    icon: "heart",
    heading: "Support for children’s education",
    description: "Support for children’s education",
    order: 5,
  },
  {
    _id: "d6",
    icon: "users",
    heading: "Providing medical assistance and medicines for those in need",
    description: "Providing medical assistance and medicines for those in need",
    order: 6,
  },
];

const visionStatement =
  "To build a compassionate society where every vulnerable individual receives the support, dignity, and opportunities needed to live a better life.";

const coreValues = [
  "Compassion: Serving people with kindness, empathy, and respect.",
  "Transparency: Maintaining honesty and accountability in all activities.",
  "Community Support: Strengthening communities through collective care and responsibility.",
  "Integrity: Acting with sincerity and ethical responsibility in all initiatives.",
  "Inclusivity: Helping anyone who is genuinely in need without discrimination.",
];

export default function ImpactSection({ items: _items }: ImpactSectionProps) {
  const displayItems = defaultItems;

  return (
    <section className="py-[60px] bg-white">
      <div className="max-w-6xl mx-auto px-5">
        <ScrollReveal>
          <div className="text-left mb-10">
            <p className="section-kicker text-sage-600 mb-1">
              Achievements
            </p>
            <h2 className="text-[32px] md:text-[42px] font-bold text-sage-900 leading-tight">
              Key <span className="bg-clip-text text-transparent bg-gradient-to-r from-sage-600 to-sage-400">Achievements</span>
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 mt-6 md:mt-10">
          {displayItems.map((item, i) => {
            const stepNumber = String(i + 1).padStart(2, "0");
            return (
              <ScrollReveal key={item._id} delay={i * 0.08}>
                <div className="relative bg-sage-50 rounded-[12px] p-6 lg:p-7 pt-10 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-sage-200 h-full flex flex-col group">
                  <div className="absolute -top-5 left-6 bg-gradient-to-br from-sage-400 to-sage-600 text-white text-[15px] font-bold w-[46px] h-[40px] rounded-[12px] flex items-center justify-center transform group-hover:scale-110 group-hover:-translate-y-1 transition-transform duration-300">
                    {stepNumber}
                  </div>

                  <h3 className="font-bold text-sage-900 text-[18px] mb-2 leading-snug">
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
