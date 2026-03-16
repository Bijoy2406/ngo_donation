"use client";

import { useState, useEffect, useRef, type MouseEvent } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Cormorant_Garamond } from "next/font/google";
import { usePathname } from "next/navigation";
import foundationLogo from "@/assets/1000055988-removebg-preview.png";
import { useDonationModal } from "@/lib/context/DonationModalContext";
import { HiMenu, HiX } from "react-icons/hi";
import {
  cn,
  DONATE_NOW_BUTTON_CLASS,
  DONATE_NOW_LABEL_CLASS,
} from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#about", label: "About Us" },
  { href: "/events", label: "Events" },
  { href: "/team", label: "Team" },
  { href: "/#mission", label: "Mission" },
  { href: "/contact", label: "Contact Us" },
];

type HomeSection = "about" | "mission";

const NAV_SCROLL_OFFSET = 108;
const SECTION_PROBE_OFFSET = 24;
const SCROLL_ACTIVE_SYNC_DELAY_MS = 90;
const NAV_PILL_TRANSITION = {
  type: "spring" as const,
  stiffness: 210,
  damping: 32,
  mass: 1,
};

const isHomeSection = (value: string): value is HomeSection =>
  value === "about" || value === "mission";

const brandFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<HomeSection | "">("");
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);
  const pendingActiveSectionRef = useRef<HomeSection | "" | null>(null);
  const activeSectionTimerRef = useRef<number | null>(null);
  const pathname = usePathname();
  const { openModal } = useDonationModal();

  const clearActiveSectionTimer = () => {
    if (activeSectionTimerRef.current !== null) {
      window.clearTimeout(activeSectionTimerRef.current);
      activeSectionTimerRef.current = null;
    }

    pendingActiveSectionRef.current = null;
  };

  const setActiveSectionImmediate = (section: HomeSection | "") => {
    clearActiveSectionTimer();
    setActiveSection(section);
  };

  const queueActiveSectionFromScroll = (section: HomeSection | "") => {
    pendingActiveSectionRef.current = section;

    if (activeSectionTimerRef.current !== null) {
      return;
    }

    activeSectionTimerRef.current = window.setTimeout(() => {
      activeSectionTimerRef.current = null;
      const nextSection = pendingActiveSectionRef.current;
      pendingActiveSectionRef.current = null;

      if (nextSection !== null) {
        setActiveSection((currentSection) =>
          currentSection === nextSection ? currentSection : nextSection
        );
      }
    }, SCROLL_ACTIVE_SYNC_DELAY_MS);
  };

  const scrollToHomeSection = (section: HomeSection, behavior: ScrollBehavior) => {
    const sectionEl = document.getElementById(section);

    if (!sectionEl) {
      return false;
    }

    const sectionTop = sectionEl.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({
      top: Math.max(0, sectionTop - NAV_SCROLL_OFFSET),
      behavior,
    });

    return true;
  };

  const getActiveSectionFromScroll = (): HomeSection | "" => {
    const aboutSection = document.getElementById("about");
    const missionSection = document.getElementById("mission");

    if (!aboutSection || !missionSection) {
      return "";
    }

    const probeY = window.scrollY + NAV_SCROLL_OFFSET + SECTION_PROBE_OFFSET;
    const aboutTop = aboutSection.offsetTop;
    const aboutBottom = aboutTop + aboutSection.offsetHeight;
    const missionTop = missionSection.offsetTop;
    const missionBottom = missionTop + missionSection.offsetHeight;

    if (probeY >= aboutTop && probeY < missionTop && probeY < aboutBottom) {
      return "about";
    }

    if (probeY >= missionTop && probeY < missionBottom) {
      return "mission";
    }

    return "";
  };

  const handleNavLinkClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    setIsMobileOpen(false);

    if (href.startsWith("/#")) {
      const section = href.slice(2);

      if (!isHomeSection(section)) {
        return;
      }

      // Pre-set active section so cross-page hash navigation doesn't flicker through Home.
      setActiveSectionImmediate(section);

      if (pathname !== "/") {
        return;
      }

      event.preventDefault();

      if (scrollToHomeSection(section, "smooth")) {
        window.history.replaceState(null, "", `/#${section}`);
      }
      return;
    }

    if (pathname !== "/") {
      return;
    }

    if (href === "/") {
      event.preventDefault();
      setActiveSectionImmediate("");
      window.history.replaceState(null, "", "/");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    setHoveredHref(null);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (pathname !== "/") {
      setActiveSectionImmediate("");
      return;
    }

    let frameId: number | null = null;
    let hashSyncTimer: number | null = null;
    const syncActiveSection = (immediate = false) => {
      const section = getActiveSectionFromScroll();

      if (immediate) {
        setActiveSectionImmediate(section);
        return;
      }

      queueActiveSectionFromScroll(section);
    };

    const handleScroll = () => {
      if (frameId !== null) {
        return;
      }

      frameId = window.requestAnimationFrame(() => {
        syncActiveSection();
        frameId = null;
      });
    };

    const handleResize = () => syncActiveSection(true);

    const hash = window.location.hash.replace("#", "");
    const hashSection = isHomeSection(hash) ? hash : "";

    if (hashSection) {
      setActiveSectionImmediate(hashSection);
    } else {
      syncActiveSection(true);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    if (hashSection) {
      const alignToHash = (attempt = 0) => {
        const didScroll = scrollToHomeSection(hashSection, attempt === 0 ? "auto" : "smooth");

        if (didScroll) {
          setActiveSectionImmediate(hashSection);
          return;
        }

        if (attempt < 8) {
          hashSyncTimer = window.setTimeout(() => alignToHash(attempt + 1), 120);
        }
      };

      alignToHash();
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      clearActiveSectionTimer();

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      if (hashSyncTimer !== null) {
        window.clearTimeout(hashSyncTimer);
      }
    };
  }, [pathname]);

  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/" && activeSection === "";
    }

    if (href.startsWith("/#")) {
      return pathname === "/" && activeSection === href.slice(2);
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
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
            width={40}
            height={40}
            className="h-15 w-15 object-contain -mt-2"
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
                "mt-[0.02rem] block text-[0.68rem] sm:text-[0.74rem] font-bold uppercase tracking-[0.18em]",
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
                onClick={(event) => handleNavLinkClick(event, link.href)}
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
                  <motion.span
                    initial={false}
                    layoutId="desktop-nav-hover-pill"
                    transition={NAV_PILL_TRANSITION}
                    className="absolute inset-x-[-10px] inset-y-[-6px] rounded-full border border-white/45 bg-white/30 shadow-[0_8px_18px_rgba(222,236,230,0.5)] backdrop-blur-[4px]"
                  />
                )}
                {isActive && (
                  <motion.span
                    initial={false}
                    layoutId="desktop-nav-active-pill"
                    transition={NAV_PILL_TRANSITION}
                    className="absolute inset-x-[-10px] inset-y-[-6px] rounded-full bg-gradient-to-b from-sage-600 to-sage-700 ring-1 ring-sage-500/90 shadow-[0_8px_18px_rgba(34,98,78,0.45)]"
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
          <button
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
      {isMobileOpen && (
        <div className="md:hidden absolute top-[66px] left-3 right-3 rounded-[16px] border border-[#d8c6aa] bg-[#f7efe3]/95 shadow-[0_14px_28px_rgba(78,58,33,0.16)] backdrop-blur-md">
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
                  onClick={(event) => handleNavLinkClick(event, link.href)}
                  onMouseEnter={() => setHoveredHref(link.href)}
                  onMouseLeave={() => setHoveredHref((current) => (current === link.href ? null : current))}
                >
                  {showHoverPill && (
                    <motion.span
                      initial={false}
                      layoutId="mobile-nav-hover-pill"
                      transition={NAV_PILL_TRANSITION}
                      className="absolute inset-0 rounded-full border border-white/45 bg-white/35 shadow-[0_8px_18px_rgba(222,236,230,0.45)] backdrop-blur-[4px]"
                    />
                  )}
                  {isActive && (
                    <motion.span
                      initial={false}
                      layoutId="mobile-nav-active-pill"
                      transition={NAV_PILL_TRANSITION}
                      className="absolute inset-0 rounded-full bg-gradient-to-b from-sage-600 to-sage-700 ring-1 ring-sage-500/90 shadow-[0_8px_18px_rgba(34,98,78,0.4)]"
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}
            <button
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
        </div>
      )}
    </nav>
  );
}