"use client";

import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { useDonationModal } from "@/lib/context/DonationModalContext";

export default function DonationHighlight() {
  const { openModal } = useDonationModal();

  return (
    <section className="py-[80px] bg-[#2563EB]">
      <div className="max-w-6xl mx-auto px-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          {/* Left content */}
          <ScrollReveal direction="left" className="max-w-lg">
            <h2 className="text-[22px] md:text-[28px] font-bold text-white leading-snug">
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
                className="bg-white text-[#2563EB] text-sm font-bold px-7 py-3 rounded-[8px] hover:bg-sage-50 transition-colors shadow-md hover:scale-105 duration-200"
              >
                Donate Now
              </button>
              <Link
                href="/contact"
                className="border-2 border-white text-white text-sm font-bold px-7 py-3 rounded-[8px] hover:bg-white/10 transition-colors text-center"
              >
                Contact Us
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
