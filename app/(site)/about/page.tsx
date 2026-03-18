import Link from "next/link";
import Counter from "@/components/ui/Counter";
import ScrollReveal from "@/components/ui/ScrollReveal";
import RichTextContent from "@/components/ui/RichTextContent";
import { getSiteSettings } from "@/sanity/lib/queries";

export const metadata = {
  title: "About Us | Farhana Afroz Foundation",
  description:
    "Learn about Farhana Afroz Foundation, our work, and the communities we serve.",
};

export default async function AboutPage() {
  const settings = await getSiteSettings();

  const heading =
    settings?.aboutHeading ?? "We believe in the power of community.";
  const description =
    settings?.aboutDescription ??
    "Farhana Afroz Foundation (FAF) is a humanitarian organisation established in 2009 with the goal of providing meaningful support to individuals and families facing financial hardship, natural disasters, or lack of basic necessities. The foundation works actively through initiatives such as building homes, distributing food, and delivering flood relief. FAF believes that anyone genuinely in need deserves compassion and support, striving to create a safe space where people can seek help with dignity.";

  const totalEvents = settings?.totalEvents ?? 120;
  const peopleEngaged = settings?.peopleEngaged ?? 25000;
  const yearsActive = settings?.yearsActive ?? 17;

  return (
    <>
      <section className="pt-28 pb-10 bg-sage-50">
        <div className="max-w-6xl mx-auto px-5">
          <ScrollReveal>
            <p className="text-xs font-semibold text-sage-500 uppercase tracking-widest mb-2">
              About Us
            </p>
            <h1 className="text-[30px] md:text-[42px] font-bold text-sage-900 leading-tight max-w-3xl">
              {heading}
            </h1>
          </ScrollReveal>
        </div>
      </section>

      <section className="pb-8 bg-white">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 -mt-2">
            <ScrollReveal className="lg:col-span-8 rounded-[14px] border border-sage-100 bg-white shadow-card p-6 md:p-8">
              <p className="text-xs font-semibold text-sage-500 uppercase tracking-widest mb-3">
                Who We Are
              </p>
              <RichTextContent
                value={description}
                className="text-[14px] md:text-[15px] leading-[1.8]"
              />
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/events"
                  className="group inline-flex items-center gap-1 rounded-[8px] bg-sage-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sage-600"
                >
                  <span>Explore Events</span>
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  >
                    &rarr;
                  </span>
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center rounded-[8px] border border-sage-300 px-5 py-2.5 text-sm font-semibold text-sage-800 transition-colors hover:bg-sage-50"
                >
                  Contact Us
                </Link>
              </div>
            </ScrollReveal>

            <div className="lg:col-span-4 flex flex-col gap-6">
              <ScrollReveal delay={0.05} className="rounded-[14px] border border-sage-100 bg-sage-50 p-5 md:p-6">
                <p className="text-xs font-semibold text-sage-500 uppercase tracking-widest mb-5">
                  Foundation Snapshot
                </p>
                <div className="space-y-5">
                  <Counter target={totalEvents} label="Events" suffix="+" />
                  <Counter target={peopleEngaged} label="People Impacted" suffix="+" />
                  <Counter target={yearsActive} label="Years Active" suffix="+" />
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.1} className="rounded-[14px] border border-sage-100 bg-white p-5 md:p-6">
                <p className="text-sm font-semibold text-sage-900 mb-2">Driven by dignity</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  We work directly with communities to deliver practical support with
                  empathy and accountability.
                </p>
                <Link
                  href="/mission"
                  className="group mt-4 inline-flex items-center gap-1 text-sm font-semibold text-sage-700 hover:text-sage-600"
                >
                  <span>Read Our Mission</span>
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
