"use client";

import { useDonationModal } from "@/lib/context/DonationModalContext";
//import { FaWhatsapp } from "react-icons/fa";
import {
  cn,
  DONATE_NOW_BUTTON_CLASS,
  DONATE_NOW_LABEL_CLASS,
} from "@/lib/utils";

interface FloatingActionsProps {
  whatsapp?: string | null;
}

export default function FloatingActions({ whatsapp }: FloatingActionsProps) {
  const { openModal } = useDonationModal();

  void whatsapp;

  return (
    <div className="fixed bottom-6 right-5 z-50 flex flex-col gap-3 items-end">


      {/* Donate Now */}
      <button
        onClick={openModal}
        aria-label="Donate Now"
        className={cn(
          DONATE_NOW_BUTTON_CLASS,
          "h-12 rounded-full px-5 hover:scale-105"
        )}
      >
        <span className={DONATE_NOW_LABEL_CLASS}>Donate Now</span>
        <div className="absolute top-0 -bottom-1 w-10 bg-white/20 -skew-x-[20deg] animate-shimmer-sweep pointer-events-none" />
      </button>
    </div>
  );
}
