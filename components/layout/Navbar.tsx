"use client";

import { useState, useSyncExternalStore } from "react";
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Cormorant_Garamond } from "next/font/google";
import { usePathname } from "next/navigation";
import foundationLogo from "@/public/assets/Farhana Afroz Foundation_LogoMark-01.svg";
import { useDonationModal } from "@/lib/context/DonationModalContext";
import { HiMenu, HiX } from "react-icons/hi";
import {
  cn,
  DONATE_NOW_BUTTON_CLASS,
  DONATE_NOW_LABEL_CLASS,
} from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/events", label: "Events" },
  { href: "/team", label: "Team" },
  { href: "/mission", label: "Mission" },
  { href: "/contact", label: "Contact Us" },
];
const NAV_PILL_TRANSITION = {
  type: "spring" as const,
  stiffness: 210,
  damping: 32,
  mass: 1,
};

const brandFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  // Track hovered href alongside the pathname it was set on so we can clear
  // it during render (not in an effect) when navigation happens.
  const [hoverState, setHoverState] = useState<{ href: string; pathname: string } | null>(null);
  const pathname = usePathname();
  const { openModal } = useDonationModal();

  // Derive the effective hovered href: clear it inline if pathname changed.
  const hoveredHref = hoverState?.pathname === pathname ? hoverState.href : null;

  const isScrolled = useSyncExternalStore(
    (cb) => {
      window.addEventListener("scroll", cb, { passive: true });
      return () => window.removeEventListener("scroll", cb);
    },
    () => window.scrollY > 40,
    () => false
  );

  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const setHoveredHref = (href: string | null) => {
    setHoverState(href ? { href, pathname } : null);
  };

  return (
    <LazyMotion features={domAnimation}>
      <nav className="fixed top-4 left-0 right-0 z-50 px-3 md:px-5">
        <div
          className={cn(
            "max-w-6xl mx-auto h-[60px] flex items-center justify-between rounded-[20px] border transition-all duration-300 px-5",
            isScrolled
              ? "bg-[#f3eadb]/95 border-[#d5c3a8] shadow-[0_12px_26px_rgba(84,65,37,0.14)] backdrop-blur-md"
                : "bg-[#efe3cf]/90 border-[#d9c8ad] shadow-[0_8px_18px_rgba(84,65,37,0.12)] backdrop-blur-md"
          )}
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center shrink-0"
            aria-label="Farhana Afroz Foundation"
          >
            <Image
              src={foundationLogo}
              alt="Farhana Afroz Foundation"
              width={48}
              height={48}
              className="h-12 w-12 self-center object-contain"
              priority
            />
            <div className="ml-2 flex flex-col leading-[1.02]">
              <span
                className={cn(
                  brandFont.className,
                  "block text-[0.68rem] sm:text-[0.74rem] font-bold uppercase tracking-[0.18em]",
                  isScrolled ? "text-sage-900" : "text-sage-800"
                )}
              >
                Farhana
              </span>
              <span
                className={cn(
                  brandFont.className,
                  "-mt-[0.1rem] block text-[0.68rem] sm:text-[0.74rem] font-bold uppercase tracking-[0.18em]",
                  isScrolled ? "text-sage-900" : "text-sage-800"
                )}
              >
                Afroz
              </span>
              <span
                className={cn(
                  brandFont.className,
                  "mt-[0.03rem] block text-[0.78rem] sm:text-[0.78rem] font-bold uppercase tracking-[0.18em]",
                  isScrolled ? "text-sage-900" : "text-sage-800"
                )}
              >
                Foundation
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div
            className="hidden md:flex items-center gap-7"
            onMouseLeave={() => setHoveredHref(null)}
          >
            {navLinks.map((link) => {
              const isActive = isActiveLink(link.href);
              const showHoverPill = hoveredHref === link.href && !isActive;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  onMouseEnter={() => setHoveredHref(link.href)}
                  className={cn(
                    "relative z-0 px-2 py-1 text-sm font-medium transition-all duration-500 ease-out",
                    isActive
                      ? "text-white"
                      : isScrolled
                      ? "text-sage-900 hover:text-sage-700"
                      : "text-sage-800 hover:text-sage-700"
                  )}
                >
                  {showHoverPill && (
                    <m.span
                      initial={false}
                      layoutId="desktop-nav-hover-pill"
                      transition={NAV_PILL_TRANSITION}
                      className="absolute inset-x-[-10px] inset-y-[-6px] rounded-full border border-white/45 bg-white/30 shadow-[0_8px_18px_rgba(222,236,230,0.5)] backdrop-blur-[4px]"
                    />
                  )}
                  <AnimatePresence>
                    {isActive && (
                      <m.span
                        key="desktop-nav-active-pill"
                        layoutId="desktop-nav-active-pill"
                        initial={{ opacity: 0, scale: 0.88 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.88 }}
                        transition={NAV_PILL_TRANSITION}
                        className="absolute inset-x-[-10px] inset-y-[-6px] rounded-full bg-gradient-to-b from-sage-600 to-sage-700 ring-1 ring-sage-500/90 shadow-[0_8px_18px_rgba(34,98,78,0.45)]"
                      />
                    )}
                  </AnimatePresence>
                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}
            <button
              type="button"
              onClick={openModal}
              className={cn(DONATE_NOW_BUTTON_CLASS, "block")}
            >
              <span className={DONATE_NOW_LABEL_CLASS}>Donate Now</span>
              {/* Glossy sweep animation */}
              <div className="absolute top-0 -bottom-1 w-8 bg-white/20 -skew-x-[20deg] animate-shimmer-sweep pointer-events-none group-hover:hidden" />
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            type="button"
            className={cn(
              "md:hidden transition-colors duration-300 drop-shadow-[0_1px_2px_rgba(255,255,255,0.6)]",
              isScrolled ? "text-sage-900" : "text-sage-800"
            )}
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Toggle menu"
          >
            {isMobileOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
        {isMobileOpen && (
          <m.div
            key="mobile-drawer"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 280, damping: 28, mass: 0.8 }}
            className="md:hidden absolute top-[66px] left-3 right-3 rounded-[16px] border border-[#d8c6aa] bg-[#f7efe3]/95 shadow-[0_14px_28px_rgba(78,58,33,0.16)] backdrop-blur-md"
          >
            <div className="flex flex-col px-5 py-4 gap-4">
              {navLinks.map((link) => {
                const isActive = isActiveLink(link.href);
                const showHoverPill = hoveredHref === link.href && !isActive;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "relative rounded-full px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "text-white"
                        : "text-sage-800 hover:bg-sage-50 hover:text-sage-600"
                    )}
                    onClick={() => setIsMobileOpen(false)}
                    onMouseEnter={() => setHoveredHref(link.href)}
                    onMouseLeave={() =>
                      setHoverState((current) =>
                        current?.href === link.href ? null : current
                      )
                    }
                  >
                    {showHoverPill && (
                      <m.span
                        initial={false}
                        layoutId="mobile-nav-hover-pill"
                        transition={NAV_PILL_TRANSITION}
                        className="absolute inset-0 rounded-full border border-white/45 bg-white/35 shadow-[0_8px_18px_rgba(222,236,230,0.45)] backdrop-blur-[4px]"
                      />
                    )}
                    <AnimatePresence>
                      {isActive && (
                        <m.span
                          key="mobile-nav-active-pill"
                          layoutId="mobile-nav-active-pill"
                          initial={{ opacity: 0, scale: 0.88 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.88 }}
                          transition={NAV_PILL_TRANSITION}
                          className="absolute inset-0 rounded-full bg-gradient-to-b from-sage-600 to-sage-700 ring-1 ring-sage-500/90 shadow-[0_8px_18px_rgba(34,98,78,0.4)]"
                        />
                      )}
                    </AnimatePresence>
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                );
              })}
              <button
                type="button"
                onClick={() => {
                  openModal();
                  setIsMobileOpen(false);
                }}
                className={cn(DONATE_NOW_BUTTON_CLASS, "mt-1 w-full py-2.5")}
              >
                <span className={DONATE_NOW_LABEL_CLASS}>Donate Now</span>
                {/* Glossy sweep animation */}
                <div className="absolute top-0 -bottom-1 w-12 bg-white/20 -skew-x-[20deg] animate-shimmer-sweep pointer-events-none group-hover:hidden" />
              </button>
            </div>
          </m.div>
        )}
        </AnimatePresence>
      </nav>
    </LazyMotion>
  );
}
