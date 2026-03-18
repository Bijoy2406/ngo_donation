"use client";

import Link from "next/link";
import Counter from "@/components/ui/Counter";
import ScrollReveal from "@/components/ui/ScrollReveal";
import RichTextContent from "@/components/ui/RichTextContent";
import type { SiteSettings } from "@/types";

interface AboutSectionProps {
  settings: SiteSettings | null;
}

export default function AboutSection({ settings }: AboutSectionProps) {
  const heading =
    settings?.aboutHeading ?? "We believe in the power of community.";
  const description =
    settings?.aboutDescription ??
    "Farhana Afroz Foundation (FAF) is a humanitarian organisation established in 2009 with the goal of providing meaningful support to individuals and families facing financial hardship, natural disasters, or lack of basic necessities. The foundation works actively through initiatives such as building homes, distributing food, and delivering flood relief. FAF believes that anyone genuinely in need deserves compassion and support, striving to create a safe space where people can seek help with dignity.";

  const totalEvents = settings?.totalEvents ?? 120;
  const peopleEngaged = settings?.peopleEngaged ?? 25000;
  const yearsActive = settings?.yearsActive ?? 17;

  // Split heading to colorize the last word
  const headingWords = heading.split(" ");
  const lastWord = headingWords.pop();
  const restOfHeading = headingWords.join(" ");

  return (
    <section id="about" className="scroll-mt-28 py-[60px] bg-white">
      <div className="max-w-6xl mx-auto px-5">
        {/* Top label row */}
        <div className="mb-8">
          <p className="section-kicker text-sage-600">
            About Us
          </p>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Left — Intro + CTA */}
          <ScrollReveal direction="left">
            <div className="flex flex-col justify-between h-full gap-8">
              <div>
                <h2 className="text-[32px] md:text-[42px] font-bold text-sage-900 leading-tight">
                  {restOfHeading}{" "}
                  {lastWord && (
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-sage-600 to-sage-400">
                      {lastWord}
                    </span>
                  )}
                </h2>
                <Link
                  href="/team"
                  className="group mt-6 inline-flex items-center gap-1 text-sm font-semibold text-white bg-sage-500 px-5 py-2.5 rounded-[8px] hover:bg-sage-600 transition-colors self-start"
                >
                  <span>Meet Our Team</span>
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  >
                    &rarr;
                  </span>
                </Link>
              </div>

              {/* Counters */}
              <div className="grid grid-cols-3 gap-4 border-t border-sage-100 pt-6">
                <Counter
                  target={totalEvents}
                  label="Events"
                  suffix="+"
                />
                <Counter
                  target={peopleEngaged}
                  label="Impacted"
                  suffix="+"
                />
                <Counter
                  target={yearsActive}
                  label="Years Active"
                  suffix="+"
                />
              </div>
            </div>
          </ScrollReveal>

          {/* Right — Description */}
          <ScrollReveal direction="right" delay={0.1}>
            <div className="bg-sage-50 rounded-[8px] p-6 md:p-8 h-full flex flex-col justify-between gap-8">
              <RichTextContent
                value={description}
                className="text-[14px] md:text-[15px] leading-[1.75]"
              />
              <Link
                href="/#mission"
                className="group inline-flex items-center gap-1 text-sm font-semibold text-white bg-sage-500 px-5 py-2.5 rounded-[8px] hover:bg-sage-600 transition-colors self-start"
              >
                <span>Our Mission</span>
                <span
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-1"
                >
                  &rarr;
                </span>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
