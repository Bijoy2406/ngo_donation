"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useDonationModal } from "@/lib/context/DonationModalContext";
import { urlFor } from "@/sanity/lib/image";
import type { SiteSettings } from "@/types";

interface HeroSectionProps {
  settings: SiteSettings | null;
}

export default function HeroSection({ settings }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { openModal } = useDonationModal();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  const heroImageUrl = settings?.heroImage
    ? urlFor(settings.heroImage).width(1920).format("webp").quality(80).url()
    : null;

  const heading =
    settings?.heroHeading ?? "Empowering Communities, Changing Lives";
  const subheading =
    settings?.heroSubheading ??
    "Join us in making a meaningful difference through education, health, and community development.";

  return (
    <section
      ref={sectionRef}
      className="relative h-[90vh] min-h-[520px] overflow-hidden flex items-center"
    >
      {/* Parallax Background */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 w-full h-[120%] -top-[10%]"
      >
        {heroImageUrl ? (
          <Image
            src={heroImageUrl}
            alt="Hero background"
            fill
            priority
            className="object-cover no-select"
            draggable={false}
          />
        ) : (
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-500 font-semibold text-2xl md:text-4xl no-select">
            1920 x 1080
          </div>
        )}
      </motion.div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-5 w-full">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-xl"
        >
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-[28px] md:text-[38px] lg:text-[46px] font-bold text-white leading-tight no-select"
          >
            {heading}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="text-white/85 text-sm md:text-base mt-4 leading-relaxed max-w-md no-select"
          >
            {subheading}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8"
          >
            <button
              onClick={openModal}
              className="bg-sage-500 hover:bg-sage-400 text-white font-semibold text-sm px-8 py-3.5 rounded-[8px] hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Donate Now
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
      >
        <span className="text-white/50 text-xs tracking-widest uppercase">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-white/50 to-transparent"
        />
      </motion.div>
    </section>
  );
}
