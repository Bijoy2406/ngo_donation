import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function ContactStrip() {
  return (
    <section className="py-[60px]">
      <div className="max-w-6xl mx-auto px-5">
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-[18px] border border-[#0f6f68]/20 bg-gradient-to-r from-[#0a5d59] via-[#0f6f68] to-[#127f75] px-6 py-10 md:px-10 md:py-12 shadow-xl">
            <div className="absolute -top-10 -right-8 h-36 w-36 rounded-full bg-white/10 blur-xl" />
            <div className="absolute -bottom-14 left-8 h-36 w-36 rounded-full bg-[#8fd9ca]/20 blur-2xl" />

            <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <p className="section-kicker section-kicker--light text-white/85 mb-2">Contact Us</p>
                <h3 className="text-[24px] md:text-[32px] font-bold text-white leading-tight text-shadow-soft">
                  Let us build meaningful change together.
                </h3>
                <p className="mt-3 text-sm md:text-base text-white/85 leading-relaxed">
                  Whether you want to volunteer, partner, or ask a question, our team is ready to hear from you.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/contact"
                  className="rounded-[10px] bg-white px-6 py-3 text-sm font-bold text-[#0b5e59] shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl"
                >
                  Contact Our Team
                </Link>
                <Link
                  href="/events"
                  className="rounded-[10px] border border-white/60 bg-white/10 px-6 py-3 text-center text-sm font-semibold text-white transition-all duration-300 hover:bg-white/20 hover:-translate-y-0.5"
                >
                  Explore Events
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
