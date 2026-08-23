"use client";

import { useEffect, useRef, useState } from "react";
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { HiArrowLeft, HiCheck, HiDuplicate, HiX } from "react-icons/hi";
import { useDonationModal } from "@/lib/context/DonationModalContext";
import { urlFor, getBlurUrl } from "@/sanity/lib/image";
import type { DonationSettings } from "@/types";
import {
  ChevronDown,
  Landmark,
  Scan,
  ShieldCheck,
  Smartphone,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

// -----------------------------------------------------------------------------
// NOTE: The SSLCommerz on-site payment form is TEMPORARILY DISABLED.
// Clicking "Donate Now" now opens this modal with a QR code (managed in
// Sanity → "Donation Settings" → "QR Code Image") so supporters can scan
// and donate directly from their phone. To bring back the SSLCommerz flow,
// restore the commented-out <form> block further down and the removed
// states/handler at the top (see git history for the original file).
// -----------------------------------------------------------------------------

interface DonationModalProps {
  donation?: DonationSettings | null;
}

const DEFAULT_STEPS = [
  "Open your bKash app",
  "Tap “Scan QR”",
  "Enter your donation amount and confirm the payment",
];

type BankDetailKey =
  | "bankName"
  | "branchName"
  | "accountName"
  | "accountNumber"
  | "swiftCode"
  | "routingNumber";

interface BankField {
  label: string;
  value: string;
  wide?: boolean;
}

const BANK_FIELD_SOURCES: { label: string; key: BankDetailKey; wide?: boolean }[] = [
  { label: "Bank Name", key: "bankName" },
  { label: "Branch Name", key: "branchName" },
  { label: "Account Name", key: "accountName" },
  { label: "Account Number", key: "accountNumber", wide: true },
  { label: "SWIFT Code", key: "swiftCode" },
  { label: "Routing Number", key: "routingNumber" },
];

function getBankFields(donation?: DonationSettings | null): BankField[] {
  if (!donation) return [];
  return BANK_FIELD_SOURCES.flatMap((source) => {
    const value = donation[source.key];
    return typeof value === "string" && value.trim().length > 0
      ? [{ label: source.label, value: value.trim(), wide: source.wide }]
      : [];
  });
}

function BankDetailField({
  label,
  value,
  wide,
  isCopied,
  onCopy,
}: {
  label: string;
  value: string;
  wide?: boolean;
  isCopied: boolean;
  onCopy: () => void;
}) {
  return (
    <div
      className={cn(
        "rounded-[12px] border border-[#e8ddd0] bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md",
        wide && "sm:col-span-2"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-sage-500">
          {label}
        </p>
        <button
          type="button"
          onClick={onCopy}
          aria-label={isCopied ? `${label} copied` : `Copy ${label}`}
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors duration-150",
            isCopied
              ? "bg-sage-100 text-sage-700"
              : "text-sage-400 hover:bg-sage-50 hover:text-sage-700"
          )}
        >
          {isCopied ? <HiCheck size={14} /> : <HiDuplicate size={14} />}
        </button>
      </div>
      <p className="mt-1.5 select-all break-words text-sm font-bold leading-snug text-sage-900 sm:text-[15px]">
        {value}
      </p>
    </div>
  );
}

export default function DonationModal({ donation }: DonationModalProps) {
  const { isOpen, closeModal } = useDonationModal();
  const [view, setView] = useState<"qr" | "bank">("qr");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const bankFields = getBankFields(donation);
  const hasBankDetails = bankFields.length > 0;

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (view === "bank") setView("qr");
        else closeModal();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [closeModal, view]);

  useEffect(() => {
    if (isOpen) setView("qr");
  }, [isOpen]);

  useEffect(() => {
    panelRef.current?.scrollTo({ top: 0 });
  }, [view]);

  useEffect(() => {
    return () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    };
  }, []);

  const handleCopy = async (field: BankField) => {
    try {
      await navigator.clipboard.writeText(field.value);
      setCopiedField(field.label);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopiedField(null), 2000);
    } catch {
      setCopiedField(null);
    }
  };

  const qrCode = donation?.qrCode;
  const qrUrl = qrCode
    ? urlFor(qrCode).width(512).format("auto").quality("auto:good").url()
    : null;
  const qrBlur = qrCode ? getBlurUrl(qrCode) : undefined;
  const steps = donation?.rules?.length ? donation.rules : DEFAULT_STEPS;

  const viewTransition = { duration: 0.22, ease: "easeOut" as const };

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {isOpen && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4"
            onClick={closeModal}
          >
            <m.div
              ref={panelRef}
              initial={{ scale: 0.95, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 24 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="bg-[#faf6f0] w-full sm:max-w-2xl rounded-t-[20px] sm:rounded-[16px] max-h-[92dvh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 z-10 flex items-start justify-between border-b border-[#e8ddd0] bg-[#faf6f0]/95 px-6 pt-5 pb-4 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  {view === "bank" && (
                    <button
                      type="button"
                      onClick={() => setView("qr")}
                      aria-label="Back to QR code"
                      className="-ml-1.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sage-500 transition-colors hover:bg-sage-100 hover:text-sage-800"
                    >
                      <HiArrowLeft size={18} />
                    </button>
                  )}
                  <div>
                    <h2 className="text-lg font-bold text-sage-900">
                      {view === "bank" ? "Bank Transfer" : "Make a Donation"}
                    </h2>
                    <p className="text-sm text-sage-600 mt-0.5">
                      {view === "bank"
                        ? "Transfer directly to our bank account"
                        : "Scan the QR code to donate securely"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="ml-4 mt-0.5 text-sage-400 hover:text-sage-700 transition-colors shrink-0"
                  aria-label="Close"
                >
                  <HiX size={20} />
                </button>
              </div>

              <AnimatePresence mode="wait" initial={false}>
                {view === "qr" ? (
                  <m.div
                    key="view-qr"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={viewTransition}
                  >
                    {/* QR code view */}
                    {qrUrl ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-[#e8ddd0]">
                        {/* Left Column: QR code image — fills the whole left side */}
                        <div className="relative w-full h-[320px] sm:h-full min-h-[320px] sm:min-h-[480px] bg-[#faf6f0] flex items-center justify-center overflow-hidden">
                          <Image
                            src={qrUrl}
                            alt="Scan this QR code to donate to Farhana Afroz Foundation"
                            fill
                            priority
                            placeholder={qrBlur ? "blur" : "empty"}
                            blurDataURL={qrBlur}
                            draggable={false}
                            className="select-none object-contain"
                          />
                        </div>

                        {/* Right Column: Heading + steps */}
                        <div className="p-6 sm:p-8 flex flex-col justify-center bg-[#faf6f0]">
                          <h3 className="text-xl sm:text-2xl font-extrabold text-sage-900 text-center mb-6">
                            {donation?.heading || "Donate via QR Code"}
                          </h3>
                          {donation?.description && (
                            <p className="text-center -mt-4 mb-6 max-w-sm mx-auto text-sm text-sage-600 leading-relaxed">
                              {donation.description}
                            </p>
                          )}

                          {steps.length > 0 && (
                            <div className="flex flex-col">
                              {steps.map((step, i) => (
                                <div key={i} className="flex flex-col">
                                  {i > 0 && (
                                    <div className="my-1 text-sage-400 flex justify-center">
                                      <ChevronDown className="w-5 h-5 animate-pulse-slow" />
                                    </div>
                                  )}
                                  <div className="flex items-center gap-4 rounded-[16px] border border-[#e8ddd0] bg-white p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                                    <div className="w-12 h-12 rounded-full bg-[#133d2c] flex items-center justify-center shrink-0 shadow-inner">
                                      {i === 0 && <Smartphone className="w-5 h-5 text-white" />}
                                      {i === 1 && <Scan className="w-5 h-5 text-white" />}
                                      {i === 2 && <Wallet className="w-5 h-5 text-white" />}
                                      {i > 2 && <Wallet className="w-5 h-5 text-white" />}
                                    </div>
                                    <span className="text-sm sm:text-base font-semibold text-sage-900 leading-snug">
                                      {i + 1}. {step}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="mt-8 flex items-center justify-center gap-3 bg-sage-50/50 rounded-xl p-3 border border-sage-100/50">
                            <div className="w-8 h-8 rounded-full border border-[#d12053]/80 bg-red-50/10 flex items-center justify-center shrink-0">
                              <ShieldCheck className="w-4 h-4 text-[#d12053]" />
                            </div>
                            <p className="text-xs sm:text-sm font-semibold text-sage-800 leading-snug">
                              Your donation is secure and greatly appreciated.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="mx-6 my-8 rounded-[16px] border border-dashed border-[#d8c6aa] bg-white px-6 py-10 text-center text-sm leading-relaxed text-sage-500">
                        QR code is not set yet. Upload it in Sanity → Donation Settings
                        → QR Code Image.
                      </div>
                    )}

                    {/* Switch to bank transfer view */}
                    {hasBankDetails && (
                      <div className="border-t border-[#e8ddd0] px-6 py-4">
                        <button
                          type="button"
                          onClick={() => setView("bank")}
                          className="w-full inline-flex items-center justify-center gap-2 rounded-[10px] bg-sage-600 px-5 py-3 text-sm font-bold text-white shadow-[0_8px_24px_rgba(64,102,87,0.35)] transition-all duration-200 hover:-translate-y-[1px] hover:bg-sage-700"
                        >
                          <Landmark className="h-4 w-4" />
                          Donate via Bank Transfer
                        </button>
                      </div>
                    )}

                    {/* ===================================================================
                        SSLCommerz on-site payment form — TEMPORARILY DISABLED.
                        (Old flow: amount presets → donor details → /api/payment/initiate
                        → SSLCommerz redirect.) Restore this block, plus the PRESET_AMOUNTS
                        constant, the form states and handleSubmit() at the top of this
                        file, to turn the SSLCommerz flow back on.
                        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
                      Amount selection
                      <div>
                        <label className="block text-xs font-semibold text-sage-600 uppercase tracking-wide mb-2.5">
                          Select Amount
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          {PRESET_AMOUNTS.map((amt) => (
                            <button
                              key={amt}
                              type="button"
                              onClick={() => { setSelectedAmount(amt); setCustomAmount(""); }}
                              className={cn(
                                "py-2.5 rounded-[8px] text-sm font-semibold border transition-all duration-150",
                                selectedAmount === amt
                                  ? "bg-sage-600 text-white border-sage-600 shadow-[0_4px_12px_rgba(64,102,87,0.35)]"
                                  : "bg-white text-sage-700 border-[#ddd0bf] hover:border-sage-400 hover:bg-sage-50"
                              )}
                            >
                              ৳{amt.toLocaleString()}
                            </button>
                          ))}
                        </div>

                        <div className="mt-2.5 relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sage-500 font-medium text-sm">৳</span>
                          <input
                            type="number"
                            min="10"
                            placeholder="Custom amount"
                            value={customAmount}
                            onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null); }}
                            className="w-full pl-7 pr-4 py-2.5 rounded-[8px] border border-[#ddd0bf] bg-white text-sage-900 text-sm placeholder-sage-300 focus:outline-none focus:border-sage-500 focus:ring-1 focus:ring-sage-500/30 transition"
                          />
                        </div>
                      </div>

                        Donor info
                      <div className="space-y-3">
                        <label className="block text-xs font-semibold text-sage-600 uppercase tracking-wide">
                          Your Details
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Full Name *"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-[8px] border border-[#ddd0bf] bg-white text-sage-900 text-sm placeholder-sage-300 focus:outline-none focus:border-sage-500 focus:ring-1 focus:ring-sage-500/30 transition"
                        />
                        <input
                          type="email"
                          required
                          placeholder="Email Address *"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-[8px] border border-[#ddd0bf] bg-white text-sage-900 text-sm placeholder-sage-300 focus:outline-none focus:border-sage-500 focus:ring-1 focus:ring-sage-500/30 transition"
                        />
                        <input
                          type="tel"
                          required
                          placeholder="Phone Number *"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-[8px] border border-[#ddd0bf] bg-white text-sage-900 text-sm placeholder-sage-300 focus:outline-none focus:border-sage-500 focus:ring-1 focus:ring-sage-500/30 transition"
                        />
                        <input
                          type="text"
                          placeholder="Address (optional)"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-[8px] border border-[#ddd0bf] bg-white text-sage-900 text-sm placeholder-sage-300 focus:outline-none focus:border-sage-500 focus:ring-1 focus:ring-sage-500/30 transition"
                        />
                      </div>

                      {error && (
                        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-[8px] px-3 py-2">
                          {error}
                        </p>
                      )}

                        Submit
                      <button
                        type="submit"
                        disabled={loading}
                        className={cn(
                          "w-full py-3 rounded-[8px] text-sm font-bold text-white transition-all duration-200 relative overflow-hidden",
                          loading
                            ? "bg-sage-400 cursor-not-allowed"
                            : "bg-sage-600 hover:bg-sage-700 shadow-[0_8px_24px_rgba(64,102,87,0.4)] hover:shadow-[0_12px_30px_rgba(64,102,87,0.5)] hover:-translate-y-[1px]"
                        )}
                      >
                        {loading ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Redirecting to payment…
                          </span>
                        ) : (
                          finalAmount >= 10
                            ? `Donate ৳${finalAmount.toLocaleString()}`
                            : "Proceed to Payment"
                        )}
                      </button>

                      <p className="text-center text-xs text-sage-400">
                        Secured by SSLCommerz · Visa · Mastercard · bKash · Nagad
                      </p>
                    </form>
                    ==================================================================== */}
                  </m.div>
                ) : (
                  <m.div
                    key="view-bank"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={viewTransition}
                  >
                    {hasBankDetails ? (
                      <div className="px-5 py-6 sm:px-6 sm:py-7">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          {bankFields.map((field) => (
                            <BankDetailField
                              key={field.label}
                              label={field.label}
                              value={field.value}
                              wide={field.wide}
                              isCopied={copiedField === field.label}
                              onCopy={() => handleCopy(field)}
                            />
                          ))}
                        </div>

                        <div className="mt-6 flex items-center justify-center gap-3 rounded-xl border border-sage-100/50 bg-sage-50/50 p-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#d12053]/80 bg-red-50/10">
                            <ShieldCheck className="h-4 w-4 text-[#d12053]" />
                          </div>
                          <p className="text-xs font-semibold leading-snug text-sage-800 sm:text-sm">
                            Please double-check the account details before transferring.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => setView("qr")}
                          className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-[10px] border border-sage-300 bg-white px-5 py-3 text-sm font-semibold text-sage-800 transition-colors hover:bg-sage-50"
                        >
                          <HiArrowLeft size={16} />
                          Back to QR Code
                        </button>
                      </div>
                    ) : (
                      <div className="mx-6 my-8 rounded-[16px] border border-dashed border-[#d8c6aa] bg-white px-6 py-10 text-center text-sm leading-relaxed text-sage-500">
                        Bank transfer details are not set yet. Add them in Sanity →
                        Donation Settings.
                      </div>
                    )}
                  </m.div>
                )}
              </AnimatePresence>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}
