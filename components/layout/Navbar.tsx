"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useDonationModal } from "@/lib/context/DonationModalContext";
import { HiMenu, HiX } from "react-icons/hi";
import { cn } from "@/lib/utils";

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
  const { openModal } = useDonationModal();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const textClass = isScrolled ? "text-sage-900" : "text-white";
  const logoClass = isScrolled ? "text-sage-800" : "text-white";

  return (
    <nav className="fixed top-4 left-0 right-0 z-50 px-3 md:px-5">
      <div
        className={cn(
          "max-w-6xl mx-auto h-[60px] flex items-center justify-between rounded-[20px] border transition-all duration-300 px-5",
          isScrolled
            ? "bg-[#eef4ee]/92 border-sage-200 shadow-lg backdrop-blur-md"
            : "bg-[#dce8df]/76 border-sage-300/60 backdrop-blur-sm"
        )}
      >
        {/* Logo */}
        <Link
          href="/"
          className={cn(
            "font-bold text-base tracking-tight transition-colors duration-300",
            isScrolled ? logoClass : "text-sage-900"
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
                "text-sm font-medium transition-colors duration-300 hover:text-sage-400",
                isScrolled ? textClass : "text-sage-800"
              )}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={openModal}
            className="bg-sage-500 text-white text-sm font-semibold px-5 py-2 rounded-[8px] hover:bg-sage-600 transition-colors duration-200"
          >
            Donate Now
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          className={cn(
            "md:hidden transition-colors duration-300",
            isScrolled ? textClass : "text-sage-800"
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
                className="text-sm font-medium text-sage-800 hover:text-sage-500 transition-colors py-1"
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
              className="bg-sage-500 text-white text-sm font-semibold py-2.5 rounded-[8px] hover:bg-sage-600 transition-colors mt-1"
            >
              Donate Now
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
