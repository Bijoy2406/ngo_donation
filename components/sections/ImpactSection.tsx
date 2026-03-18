import ScrollReveal from "@/components/ui/ScrollReveal";
import type { ImpactItem } from "@/types";
import { cn } from "@/lib/utils";
import { Manrope } from "next/font/google";
import { Snowflake, Stethoscope } from "lucide-react";
import {
  HiOutlineAcademicCap,
  HiOutlineBeaker,
  HiOutlineBuildingLibrary,
  HiOutlineBuildingOffice,
  HiOutlineExclamationTriangle,
  HiOutlineGlobeAlt,
  HiOutlineHandRaised,
  HiOutlineHeart,
  HiOutlineHome,
  HiOutlineLightBulb,
  HiOutlinePlusCircle,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
  HiOutlineSun,
  HiOutlineUser,
  HiOutlineUserGroup,
} from "react-icons/hi2";

interface ImpactSectionProps {
  items: ImpactItem[];
}

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  heart: HiOutlineHeart,
  users: HiOutlineUserGroup,
  globe: HiOutlineGlobeAlt,
  education: HiOutlineAcademicCap,
  lightbulb: HiOutlineSparkles,
  star: HiOutlineSparkles,
  hands: HiOutlineHome,
  leaf: HiOutlineSun,
  woman: HiOutlineUser,
  community: HiOutlineUserGroup,
  firstAid: HiOutlinePlusCircle,
  medicalEmergency: HiOutlineExclamationTriangle,
  stethoscope: Stethoscope,
  officeBuilding: HiOutlineBuildingOffice,
  hand: HiOutlineHandRaised,
  library: HiOutlineBuildingLibrary,
  beaker: HiOutlineBeaker,
  lightBulb: HiOutlineLightBulb,
  shieldCheck: HiOutlineShieldCheck,
  graduation: HiOutlineAcademicCap,
  snowflake: Snowflake,
  global: HiOutlineGlobeAlt,
};

const achievementFont = Manrope({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const bentoPlacementClasses = [
  "lg:col-start-1 lg:col-span-2 lg:row-start-1 lg:row-span-2",
  "lg:col-start-3 lg:col-span-2 lg:row-start-1 lg:row-span-1",
  "lg:col-start-3 lg:col-span-1 lg:row-start-2 lg:row-span-1",
  "lg:col-start-4 lg:col-span-1 lg:row-start-2 lg:row-span-1",
  "lg:col-start-1 lg:col-span-2 lg:row-start-3 lg:row-span-1",
  "lg:col-start-3 lg:col-span-1 lg:row-start-3 lg:row-span-1",
  "lg:col-start-4 lg:col-span-1 lg:row-start-3 lg:row-span-1",
] as const;

const cardDirections = ["up", "left", "right", "up", "left", "right", "up"] as const;

const getCardText = (item: ImpactItem) => item.heading || item.description || "";

export default function ImpactSection({ items }: ImpactSectionProps) {
  const sourceItems = items.slice().sort((a, b) => a.order - b.order).slice(0, 7);

  if (sourceItems.length === 0) {
    return null;
  }

  // Put longer copy into larger bento slots for a balanced visual rhythm.
  const displayItems = sourceItems
    .slice()
    .sort((a, b) => getCardText(b).length - getCardText(a).length);

  return (
    <section className="bg-gradient-to-b from-[#eef4ec] via-[#f4f7f1] to-[#f7faf5] py-[64px] md:py-[78px]">
      <div className={cn("mx-auto max-w-6xl px-5", achievementFont.className)}>
        <ScrollReveal>
          <div className="mb-9 text-left md:mb-11">
            <p className="section-kicker mb-2 text-[#567a64]">
              Achievements
            </p>
            <h2 className="text-[34px] font-extrabold leading-[1.04] tracking-[-0.02em] text-[#173b2d] text-justify md:text-[48px]">
              Key <span className="text-[#4f7a63]">Achievements</span>
            </h2>
          </div>
        </ScrollReveal>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:mt-8 sm:grid-cols-2 lg:mt-10 lg:grid-cols-4 lg:auto-rows-[172px] lg:gap-5">
          {displayItems.map((item, i) => {
            const Icon = iconMap[item.icon] ?? HiOutlineSparkles;
            const direction = cardDirections[i] ?? "up";
            return (
              <ScrollReveal
                key={item._id}
                delay={i * 0.08}
                direction={direction}
                className={cn("h-full", bentoPlacementClasses[i] ?? "lg:col-span-1")}
              >
                <div
                  className={cn(
                    "group relative flex h-full flex-col justify-between overflow-hidden rounded-[24px] border p-6 sm:p-7",
                    "transition-shadow duration-300",
                    "border-[#bccdbf] bg-gradient-to-br from-[#d7e4d9] via-[#cfded2] to-[#c6d7ca] shadow-[0_10px_20px_rgba(18,43,31,0.12)] hover:from-[#f6fbf5] hover:via-[#edf6ec] hover:to-[#e4f0e4] hover:shadow-[0_14px_28px_rgba(18,43,31,0.16)]"
                  )}
                >
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-[#b9ccb9]/30 transition-opacity duration-300 group-hover:opacity-70" />

                  <div
                    className={cn(
                      "relative z-10",
                      "flex h-11 w-11 min-h-11 min-w-11 shrink-0 aspect-square items-center justify-center rounded-full border",
                      "border-[#c7d8cc] bg-[#f2f7f2] text-[#285540]"
                    )}
                  >
                    <Icon size={20} />
                  </div>

                  <h3
                    className={cn(
                      "relative z-10 mt-5 text-[17px] font-bold leading-[1.4] tracking-[-0.01em] text-[#173b2c] text-justify sm:text-[18px]"
                    )}
                  >
                    {getCardText(item)}
                  </h3>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
