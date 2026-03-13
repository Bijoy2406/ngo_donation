"use client";

import { useState, useEffect, useRef, type MouseEvent } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDonationModal } from "@/lib/context/DonationModalContext";
import { HiMenu, HiX } from "react-icons/hi";
import { cn, FAKE_DELAY_MS } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#about", label: "About Us" },
  { href: "/events", label: "Events" },
  { href: "/#mission", label: "Mission" },
  { href: "/contact", label: "Contact Us" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentHash, setCurrentHash] = useState("");
  const [activeIndicator, setActiveIndicator] = useState({
    left: 0,
    width: 0,
    visible: false,
  });
  const navRef = useRef<HTMLElement | null>(null);
  const desktopLinksRef = useRef<Record<string, HTMLAnchorElement | null>>({});
  const desktopLinksWrapRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { openModal } = useDonationModal();

  const getNavOffset = () => {
    const navHeight = navRef.current?.getBoundingClientRect().height ?? 60;
    return Math.round(navHeight + 20);
  };

  const scrollToSection = (
    sectionId: string,
    behavior: ScrollBehavior = "smooth",
    updateHistory = true
  ) => {
    const section = document.getElementById(sectionId);
    if (!section) {
      return false;
    }

    const targetY =
      section.getBoundingClientRect().top + window.scrollY - getNavOffset();

    window.scrollTo({ top: Math.max(targetY, 0), behavior });

    const nextHash = `#${sectionId}`;
    setCurrentHash(nextHash);

    if (updateHistory) {
      const nextUrl = `${window.location.pathname}${window.location.search}${nextHash}`;
      window.history.replaceState(null, "", nextUrl);
    }

    return true;
  };

  const handleNavLinkClick = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
    closeMobile = false
  ) => {
    if (href === "/" && pathname === "/") {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      setCurrentHash("");
      if (window.location.hash) {
        const baseUrl = `${window.location.pathname}${window.location.search}`;
        window.history.replaceState(null, "", baseUrl);
      }
      if (closeMobile) {
        setIsMobileOpen(false);
      }
      return;
    }

    if (!href.startsWith("/#")) {
      if (closeMobile) {
        setIsMobileOpen(false);
      }
      return;
    }

    event.preventDefault();
    const sectionId = href.slice(2);

    if (pathname !== "/") {
      router.push(href);
      if (closeMobile) {
        setIsMobileOpen(false);
      }
      return;
    }

    const didScroll = scrollToSection(sectionId);
    if (!didScroll) {
      router.push(href);
    }

    if (closeMobile) {
      setIsMobileOpen(false);
    }
  };

  const isActiveLink = (href: string) => {
    // Hash links are active on the homepage when their section is in view.
    if (href.startsWith("/#")) {
      return pathname === "/" && currentHash === href.slice(1);
    }

    // Keep parent nav item active for nested routes (e.g. /events/[slug]).
    if (href !== "/" && pathname.startsWith(`${href}/`)) {
      return true;
    }

    // Home is active on root when no tracked section is currently active.
    if (href === "/") {
      return pathname === "/" && !currentHash;
    }

    return pathname === href;
  };

  const getActiveLinkHref = () => {
    const activeLink = navLinks.find((link) => isActiveLink(link.href));
    return activeLink?.href;
  };

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
    if (pathname !== "/" || isLoading) {
      setCurrentHash("");
      return;
    }

    const updateActiveHash = () => {
      const aboutSection = document.getElementById("about");
      const missionSection = document.getElementById("mission");

      if (!aboutSection && !missionSection) {
        return;
      }

      const markerY = window.scrollY + getNavOffset() + 8;
      const aboutTop = aboutSection
        ? aboutSection.getBoundingClientRect().top + window.scrollY
        : Number.POSITIVE_INFINITY;
      const aboutBottom = aboutSection
        ? aboutTop + aboutSection.offsetHeight
        : Number.NEGATIVE_INFINITY;
      const missionTop = missionSection
        ? missionSection.getBoundingClientRect().top + window.scrollY
        : Number.POSITIVE_INFINITY;
      const missionBottom = missionSection
        ? missionTop + missionSection.offsetHeight
        : Number.NEGATIVE_INFINITY;

      let nextHash = "";
      if (markerY >= aboutTop && markerY < aboutBottom) {
        nextHash = "#about";
      } else if (markerY >= missionTop && markerY < missionBottom) {
        nextHash = "#mission";
      }

      setCurrentHash((prev) => (prev === nextHash ? prev : nextHash));
    };

    let frameId = 0;
    const scheduleUpdate = () => {
      if (frameId) {
        return;
      }
      frameId = window.requestAnimationFrame(() => {
        frameId = 0;
        updateActiveHash();
      });
    };

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [pathname, isLoading]);

  useEffect(() => {
    if (pathname !== "/" || isLoading) {
      return;
    }

    const hash = window.location.hash;
    if (hash !== "#about" && hash !== "#mission") {
      return;
    }

    const sectionId = hash.slice(1);
    let frameId = 0;
    let attempts = 0;
    const maxAttempts = 30;

    const alignToSection = () => {
      attempts += 1;
      const didScroll = scrollToSection(sectionId, "smooth", false);

      if (didScroll || attempts >= maxAttempts) {
        return;
      }

      frameId = window.requestAnimationFrame(alignToSection);
    };

    frameId = window.requestAnimationFrame(alignToSection);

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [pathname, isLoading]);

  useEffect(() => {
    if (isLoading) {
      setActiveIndicator((prev) => (prev.visible ? { ...prev, visible: false } : prev));
      return;
    }

    const updateIndicatorPosition = () => {
      const wrapEl = desktopLinksWrapRef.current;
      if (!wrapEl) {
        return;
      }

      const activeHref = getActiveLinkHref();
      if (!activeHref) {
        setActiveIndicator((prev) => (prev.visible ? { ...prev, visible: false } : prev));
        return;
      }

      const activeLinkEl = desktopLinksRef.current[activeHref];
      if (!activeLinkEl) {
        return;
      }

      const wrapRect = wrapEl.getBoundingClientRect();
      const linkRect = activeLinkEl.getBoundingClientRect();
      const nextLeft = Math.round(linkRect.left - wrapRect.left);
      const nextWidth = Math.round(linkRect.width);

      setActiveIndicator((prev) => {
        if (
          prev.visible &&
          prev.left === nextLeft &&
          prev.width === nextWidth
        ) {
          return prev;
        }

        return {
          left: nextLeft,
          width: nextWidth,
          visible: true,
        };
      });
    };

    let frameId = window.requestAnimationFrame(updateIndicatorPosition);
    const handleResize = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(updateIndicatorPosition);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [pathname, currentHash, isLoading]);

  if (isLoading) {
    return (
      <nav ref={navRef} className="fixed top-4 left-0 right-0 z-50 px-3 md:px-5">
        <div
          className={cn(
            "max-w-6xl mx-auto h-[60px] flex items-center justify-between rounded-[20px] border transition-all duration-500 ease-out px-5",
            isScrolled
              ? "bg-[#eef4ee]/95 border-sage-200 shadow-lg backdrop-blur-md"
              : "bg-[#dce8df]/90 border-sage-300/80 shadow-md backdrop-blur-md"
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
    <nav ref={navRef} className="fixed top-4 left-0 right-0 z-50 px-3 md:px-5">
      <div
        className={cn(
          "max-w-6xl mx-auto h-[60px] flex items-center justify-between rounded-[20px] border transition-all duration-500 ease-out px-5",
          isScrolled
            ? "bg-[#eef4ee]/95 border-sage-200 shadow-lg backdrop-blur-md"
            : "bg-[#dce8df]/90 border-sage-300/80 shadow-md backdrop-blur-md"
        )}
      >
        {/* Logo */}
        <Link
          href="/"
          className={cn(
            "font-bold text-base tracking-tight transition-colors duration-500 ease-out [text-shadow:_0_1px_2px_rgb(255_255_255_/_60%)]",
            isScrolled ? "text-sage-800" : "text-sage-900"
          )}
        >
          Farzana Afroz Foundation
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-7">
          <div ref={desktopLinksWrapRef} className="relative flex items-center gap-2">
            <span
              aria-hidden="true"
              className={cn(
                "absolute top-1/2 -translate-y-1/2 h-9 rounded-full bg-sage-600 shadow-[0_4px_12px_rgba(82,121,111,0.35)] transition-[left,width,opacity] duration-500 ease-out",
                activeIndicator.visible ? "opacity-100" : "opacity-0"
              )}
              style={{ left: activeIndicator.left, width: activeIndicator.width }}
            />

            {navLinks.map((link) => {
              const isActive = isActiveLink(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  ref={(element) => {
                    desktopLinksRef.current[link.href] = element;
                  }}
                  aria-current={isActive ? "page" : undefined}
                  onClick={(event) => handleNavLinkClick(event, link.href)}
                  className={cn(
                    "relative z-10 text-sm font-medium px-3 py-1.5 rounded-full transform-gpu transition-[color,background-color,transform] duration-500 ease-out [text-shadow:_0_1px_2px_rgb(255_255_255_/_60%)]",
                    isActive
                      ? "text-white scale-[1.02]"
                      : isScrolled
                      ? "text-sage-900 hover:text-sage-700 hover:bg-sage-100/90 hover:scale-[1.01]"
                      : "text-sage-800 hover:text-sage-700 hover:bg-white/70 hover:scale-[1.01]"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <button
            onClick={openModal}
            className="group relative overflow-hidden bg-sage-500 text-white text-sm font-semibold px-5 py-2 rounded-[8px] shadow-[0_4px_14px_0_rgb(82,121,111,0.39)] hover:shadow-[0_6px_20px_rgba(82,121,111,0.5)] hover:bg-sage-600 hover:-translate-y-[1px] transition-all duration-200 block"
          >
            <span className="relative z-10">Donate Now</span>
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
            {navLinks.map((link) => {
              const isActive = isActiveLink(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  onClick={(event) => handleNavLinkClick(event, link.href, true)}
                  className={cn(
                    "text-sm font-medium py-1.5 px-3 rounded-lg transform-gpu transition-[background-color,color,box-shadow,transform] duration-500 ease-out",
                    isActive
                      ? "bg-sage-600 text-white shadow-[0_4px_12px_rgba(82,121,111,0.25)]"
                      : "text-sage-800 hover:text-sage-600 hover:bg-sage-100"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <button
              onClick={() => {
                openModal();
                setIsMobileOpen(false);
              }}
              className="group relative overflow-hidden w-full bg-sage-500 text-white text-sm font-semibold py-2.5 rounded-[8px] mt-1 shadow-[0_4px_14px_0_rgb(82,121,111,0.39)] hover:shadow-[0_6px_20px_rgba(82,121,111,0.5)] hover:bg-sage-600 hover:-translate-y-[1px] transition-all duration-200 block"
            >
              <span className="relative z-10">Donate Now</span>
              {/* Glossy sweep animation */}
              <div className="absolute top-0 -bottom-1 w-12 bg-white/20 -skew-x-[20deg] animate-shimmer-sweep pointer-events-none group-hover:hidden" />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
