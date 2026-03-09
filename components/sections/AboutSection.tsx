"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Counter from "@/components/ui/Counter";
import ScrollReveal from "@/components/ui/ScrollReveal";
import type { SiteSettings } from "@/types";

interface AboutSectionProps {
  settings: SiteSettings | null;
}

export default function AboutSection({ settings }: AboutSectionProps) {
  const heading =
    settings?.aboutHeading ?? "We believe in the power of community.";
  const description =
    settings?.aboutDescription ??
    "Farzana Afroz Foundation is dedicated to uplifting underprivileged communities through sustainable programs in education, healthcare, and social welfare. Since our establishment, we have worked tirelessly to create positive, lasting change in the lives of those who need it most.";

  const totalEvents = settings?.totalEvents ?? 0;
  const peopleEngaged = settings?.peopleEngaged ?? 0;
  const yearsActive = settings?.yearsActive ?? 0;

  return (
    <section id="about" className="py-[60px] bg-white">
      <div className="max-w-6xl mx-auto px-5">
        {/* Top label row */}
        <div className="flex items-center justify-between mb-10">
          {/* Animated pulse indicator */}
          <div className="relative flex items-center gap-3">
            <span className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sage-400 opacity-40" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-sage-500" />
            </span>
          </div>
          <p className="text-xs font-semibold text-sage-500 uppercase tracking-widest">
            About Us
          </p>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Left — Intro + CTA */}
          <ScrollReveal direction="left">
            <div className="flex flex-col justify-between h-full gap-8">
              <div>
                <h2 className="text-[22px] md:text-[26px] font-bold text-sage-900 leading-snug">
                  {heading}
                </h2>
                <Link
                  href="/team"
                  className="mt-6 inline-flex items-center text-sm font-semibold text-sage-600 border border-sage-200 px-5 py-2.5 rounded-[8px] hover:bg-sage-50 hover:border-sage-400 transition-all duration-200"
                >
                  Meet Our Team &rarr;
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
                  suffix=""
                />
              </div>
            </div>
          </ScrollReveal>

          {/* Right — Description */}
          <ScrollReveal direction="right" delay={0.1}>
            <div className="bg-sage-50 rounded-[8px] p-6 md:p-8 h-full flex flex-col justify-between gap-8">
              <p className="text-[14px] md:text-[15px] text-gray-600 leading-[1.75]">
                {description}
              </p>
              <Link
                href="/#mission"
                className="inline-flex items-center text-sm font-semibold text-white bg-sage-500 px-5 py-2.5 rounded-[8px] hover:bg-sage-600 transition-colors self-start"
              >
                Our Mission &rarr;
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
