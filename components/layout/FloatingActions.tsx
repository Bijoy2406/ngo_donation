"use client";

import { useDonationModal } from "@/lib/context/DonationModalContext";
import { FaWhatsapp } from "react-icons/fa";
import { HiHeart } from "react-icons/hi";
import { cn } from "@/lib/utils";

interface FloatingActionsProps {
  whatsapp?: string | null;
}

export default function FloatingActions({ whatsapp }: FloatingActionsProps) {
  const { openModal } = useDonationModal();

  const whatsappHref = whatsapp
    ? `https://wa.me/${whatsapp.replace(/\D/g, "")}`
    : "https://wa.me/";

  return (
    <div className="fixed bottom-6 right-5 z-50 flex flex-col gap-3 items-end">
      {/* WhatsApp */}
      <a
        href={whatsappHref}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className={cn(
          "flex items-center justify-center w-12 h-12 rounded-full shadow-card-hover",
          "bg-[#25D366] text-white hover:scale-110 transition-transform duration-200"
        )}
      >
        <FaWhatsapp size={22} />
      </a>

      {/* Donate Now */}
      <button
        onClick={openModal}
        aria-label="Donate Now"
        className={cn(
          "flex items-center gap-2 bg-sage-500 text-white text-sm font-semibold",
          "px-4 h-12 rounded-full shadow-card-hover hover:bg-sage-600 hover:scale-105 transition-all duration-200"
        )}
      >
        <HiHeart size={16} />
        <span className="hidden sm:inline">Donate Now</span>
      </button>
    </div>
  );
}
