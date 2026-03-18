import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";
import RichTextContent, {
  hasRichTextContent,
} from "@/components/ui/RichTextContent";
import { getMission } from "@/sanity/lib/queries";
import { getBlurUrl, urlFor } from "@/sanity/lib/image";

export const metadata = {
  title: "Mission | Farhana Afroz Foundation",
  description:
    "Discover the mission that drives Farhana Afroz Foundation's humanitarian work.",
};

const fallbackMissionText =
  "To build a compassionate society where every vulnerable individual receives the support, dignity, and opportunities needed to live a better life. Our mission is to support communities by providing humanitarian assistance, emergency relief, educational support for children, and essential seasonal aid such as winter clothing and Ramadan iftar for those in need.";

export default async function MissionPage() {
  const mission = await getMission();

  const hasImage = Boolean(mission?.image);
  const imageUrl = hasImage
    ? urlFor(mission!.image!).width(860).height(960).format("auto").quality("auto:good").url()
    : "";
  const blurUrl = hasImage ? getBlurUrl(mission!.image!) : undefined;

  const heading = mission?.heading ?? "Our Mission";
  const hasDescription = hasRichTextContent(mission?.description);

  return (
    <>
      <section className="pt-28 pb-10 bg-sage-50">
        <div className="max-w-6xl mx-auto px-5">
          <ScrollReveal>
            <p className="text-xs font-semibold text-sage-500 uppercase tracking-widest mb-2">
              Mission
            </p>
            <h1 className="text-[30px] md:text-[42px] font-bold text-sage-900 leading-tight max-w-3xl">
              {heading}
            </h1>
          </ScrollReveal>
        </div>
      </section>

      <section className="pb-[60px] bg-white">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
            <ScrollReveal direction="right" className="lg:col-span-5">
              <div className="relative overflow-hidden rounded-[14px] border border-sage-100 bg-sage-100 aspect-[4/5] shadow-card">
                {hasImage ? (
                  <Image
                    src={imageUrl}
                    alt="Mission"
                    fill
                    placeholder={blurUrl ? "blur" : "empty"}
                    blurDataURL={blurUrl}
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-sage-500 text-lg font-semibold">
                    Mission Image
                  </div>
                )}
              </div>
            </ScrollReveal>

            <div className="lg:col-span-7 flex flex-col gap-6">
              <ScrollReveal direction="left" delay={0.05} className="rounded-[14px] border border-sage-100 bg-white p-6 md:p-8 shadow-card">
                <p className="text-xs font-semibold text-sage-500 uppercase tracking-widest mb-3">
                  Purpose
                </p>
                {hasDescription ? (
                  <RichTextContent
                    value={mission?.description}
                    className="text-[14px] md:text-[15px] leading-[1.8]"
                  />
                ) : (
                  <p className="text-[14px] md:text-[15px] leading-[1.8] text-gray-600">
                    {fallbackMissionText}
                  </p>
                )}
              </ScrollReveal>

              <ScrollReveal delay={0.1} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-[14px] border border-sage-100 bg-sage-50 p-5">
                  <p className="text-sm font-semibold text-sage-900 mb-2">Relief First</p>
                  <p className="text-sm leading-relaxed text-gray-600">
                    Rapid, practical help for families facing emergencies, disasters, and sudden hardship.
                  </p>
                </div>
                <div className="rounded-[14px] border border-sage-100 bg-sage-50 p-5">
                  <p className="text-sm font-semibold text-sage-900 mb-2">Long-Term Care</p>
                  <p className="text-sm leading-relaxed text-gray-600">
                    Ongoing support through education, seasonal aid, and community-centered programs.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.15} className="flex flex-wrap gap-3">
                <Link
                  href="/about"
                  className="inline-flex items-center rounded-[8px] border border-sage-300 px-5 py-2.5 text-sm font-semibold text-sage-800 transition-colors hover:bg-sage-50"
                >
                  Learn About Us
                </Link>
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-1 rounded-[8px] bg-sage-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sage-600"
                >
                  <span>Get Involved</span>
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  >
                    &rarr;
                  </span>
                </Link>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
