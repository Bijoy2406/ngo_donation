"use client";

import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { useDonationModal } from "@/lib/context/DonationModalContext";
import { cn, DONATE_NOW_BUTTON_CLASS, DONATE_NOW_LABEL_CLASS } from "@/lib/utils";

export default function DonationHighlight() {
  const { openModal } = useDonationModal();

  return (
    <section className="py-[80px]">
      <div className="max-w-6xl mx-auto px-5">
        <div className="relative overflow-hidden rounded-[18px] border border-[#0e6d66]/25 bg-gradient-to-r from-[#0a5954] via-[#0e6d66] to-[#147f74] px-6 py-10 md:px-10 md:py-12 shadow-xl">
          <div className="absolute -top-10 right-10 h-40 w-40 rounded-full bg-white/10 blur-xl" />
          <div className="absolute -bottom-14 -left-8 h-40 w-40 rounded-full bg-[#96dfd0]/20 blur-2xl" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            {/* Left content */}
            <ScrollReveal direction="left" className="max-w-lg">
              <p className="section-kicker section-kicker--light text-white/85 mb-2">Support</p>
              <h2 className="text-[22px] md:text-[30px] font-bold text-white leading-snug text-shadow-soft">
                Make It Meaningful Today
              </h2>
              <p className="text-white/80 text-sm md:text-base mt-3 leading-relaxed">
                Your donation powers our programs in education, healthcare, and
                community development. Every contribution — big or small —
                creates real, lasting impact in the lives of those who need it
                most.
              </p>
            </ScrollReveal>

            {/* Right buttons */}
            <ScrollReveal direction="right" delay={0.1}>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={openModal}
                  className="rounded-[10px] bg-white px-6 py-3 text-sm font-bold text-[#0b5e59] shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl"
                >
                  Donate Now
                </button>
                <Link
                  href="/contact"
                  className="border border-white/70 bg-white/10 text-white text-sm font-bold px-7 py-3 rounded-[10px] hover:bg-white/20 transition-all duration-300 text-center hover:-translate-y-0.5"
                >
                  Contact Us
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
