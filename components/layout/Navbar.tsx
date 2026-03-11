"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDonationModal } from "@/lib/context/DonationModalContext";
import { HiMenu, HiX } from "react-icons/hi";
import {
  cn,
  DONATE_NOW_BUTTON_CLASS,
  DONATE_NOW_LABEL_CLASS,
  FAKE_DELAY_MS,
} from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#about", label: "About Us" },
  { href: "/events", label: "Events" },
  { href: "/team", label: "Team" },
  { href: "/#mission", label: "Mission" },
  { href: "/contact", label: "Contact Us" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string>("");
  const pathname = usePathname();
  const { openModal } = useDonationModal();

  useEffect(() => {
    // Skip skeleton entirely if delay is off
    if (FAKE_DELAY_MS === 0) {
      setIsLoading(false);
      return;
    }
    
    // Fake delay for loader verification matching the page delay
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), FAKE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (pathname !== "/") {
      setActiveSection("");
      return;
    }

    const sectionIds = ["about", "mission"];
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    const getCurrentHash = () => window.location.hash.replace("#", "");

    const syncSectionFromHash = () => {
      const hash = getCurrentHash();
      if (hash) {
        setActiveSection(hash);
      }
    };

    syncSectionFromHash();
    window.addEventListener("hashchange", syncSectionFromHash);

    if (sections.length === 0) {
      return () => window.removeEventListener("hashchange", syncSectionFromHash);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry) {
          setActiveSection(visibleEntry.target.id);
        } else if (window.scrollY < 120 && !getCurrentHash()) {
          setActiveSection("");
        }
      },
      {
        threshold: [0.35, 0.6],
        rootMargin: "-20% 0px -40% 0px",
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      window.removeEventListener("hashchange", syncSectionFromHash);
      observer.disconnect();
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



  if (isLoading) {
    return (
      <nav className="fixed top-4 left-0 right-0 z-50 px-3 md:px-5">
        <div
          className={cn(
            "max-w-6xl mx-auto h-[60px] flex items-center justify-between rounded-[20px] border transition-all duration-300 px-5",
            isScrolled
              ? "bg-[#eef4ee]/95 border-sage-200 shadow-[0_16px_36px_rgba(17,42,35,0.26)] backdrop-blur-md"
              : "bg-[#dce8df]/90 border-sage-300/80 shadow-[0_10px_24px_rgba(17,42,35,0.22)] backdrop-blur-md"
          )}
        >
          {/* Logo Skeleton */}
          <div className="skeleton h-5 w-48 rounded" />

          {/* Desktop Nav Skeleton */}
          <div className="hidden md:flex items-center gap-7">
            <div className="skeleton h-4 w-12 rounded" />
            <div className="skeleton h-4 w-16 rounded" />
            <div className="skeleton h-4 w-12 rounded" />
            <div className="skeleton h-4 w-16 rounded" />
            <div className="skeleton h-4 w-20 rounded" />
            <div className="skeleton h-9 w-[112px] rounded-[8px]" />
          </div>

          {/* Mobile Toggle Skeleton */}
          <div className="md:hidden skeleton h-6 w-6 rounded" />
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-4 left-0 right-0 z-50 px-3 md:px-5">
      <div
        className={cn(
          "max-w-6xl mx-auto h-[60px] flex items-center justify-between rounded-[20px] border transition-all duration-300 px-5",
          isScrolled
            ? "bg-[#eef4ee]/95 border-sage-200 shadow-[0_16px_36px_rgba(17,42,35,0.26)] backdrop-blur-md"
            : "bg-[#dce8df]/90 border-sage-300/80 shadow-[0_10px_24px_rgba(17,42,35,0.22)] backdrop-blur-md"
        )}
      >
        {/* Logo */}
        <Link
          href="/"
          className={cn(
            "font-bold text-base tracking-tight transition-colors duration-300 [text-shadow:_0_1px_2px_rgb(255_255_255_/_60%)]",
            isScrolled ? "text-sage-800" : "text-sage-900"
          )}
        >
          Farzana Afroz Foundation
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative text-sm font-medium transition-colors duration-300 [text-shadow:_0_1px_2px_rgb(255_255_255_/_60%)] after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:rounded-full after:bg-sage-600 after:transition-transform after:duration-300 hover:text-sage-500 hover:after:scale-x-100",
                isActiveLink(link.href)
                  ? "text-sage-700 after:scale-x-100"
                  : isScrolled
                  ? "text-sage-900"
                  : "text-sage-800"
              )}
            >
              {link.label}
            </Link>
          ))}
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
        <div className="md:hidden absolute top-[66px] left-3 right-3 rounded-[16px] bg-white/95 backdrop-blur-md shadow-lg border border-sage-200">
          <div className="flex flex-col px-5 py-4 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors py-1",
                  isActiveLink(link.href)
                    ? "text-sage-700"
                    : "text-sage-800 hover:text-sage-500"
                )}
                onClick={() => setIsMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
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
