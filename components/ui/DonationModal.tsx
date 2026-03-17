"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { HiX } from "react-icons/hi";
import { useDonationModal } from "@/lib/context/DonationModalContext";
import { urlFor } from "@/sanity/lib/image";
import type { DonationSettings } from "@/types";

interface DonationModalProps {
  settings: DonationSettings | null;
  bkashNumber?: string;
  nagadNumber?: string;
}

const defaultSettings: DonationSettings = {
  _id: "default",
  heading: "Make a Meaningful Donation",
  description:
    "Your generous contribution helps us reach more communities and create lasting impact.",
  rules: [
    "All donations are voluntary.",
    "Please include your name in the transfer reference.",
    "For international transfers, please use the SWIFT code.",
    "For any queries, please contact Farhana Afroz Foundation directly.",
  ],
  bankName: "The City Bank Limited",
  branchName: "Jamuna Future Park Branch",
  accountName: "FARHANA AFRUZ URMI",
  accountNumber: "2101906537001",
  swiftCode: "CIBLBDDH",
  routingNumber: "225260333",
};

export default function DonationModal({
  settings,
  bkashNumber,
  nagadNumber,
}: DonationModalProps) {
  const { isOpen, closeModal } = useDonationModal();
  const data = settings ?? defaultSettings;

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [closeModal]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] bg-black/60 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="bg-white rounded-[8px] max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-sage-900">
                  {data.heading}
                </h2>
                <p className="text-sm text-gray-500 mt-1">{data.description}</p>
              </div>
              <button
                onClick={closeModal}
                className="ml-4 mt-0.5 text-gray-400 hover:text-gray-700 transition-colors shrink-0"
                aria-label="Close modal"
              >
                <HiX size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Bank Details */}
              <div className="bg-sage-50 rounded-[8px] p-4 space-y-2.5">
                <p className="text-xs font-semibold text-sage-600 uppercase tracking-wide">
                  Bank Details
                </p>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <span className="text-gray-500">Bank</span>
                  <span className="font-medium text-sage-900">
                    {data.bankName}
                  </span>
                  {data.branchName && (
                    <>
                      <span className="text-gray-500">Branch</span>
                      <span className="font-medium text-sage-900">
                        {data.branchName}
                      </span>
                    </>
                  )}
                  <span className="text-gray-500">Account Name</span>
                  <span className="font-medium text-sage-900">
                    {data.accountName}
                  </span>
                  <span className="text-gray-500">Account No.</span>
                  <span className="font-medium text-sage-900 tracking-wide">
                    {data.accountNumber}
                  </span>
                  {data.swiftCode && (
                    <>
                      <span className="text-gray-500">SWIFT Code</span>
                      <span className="font-medium text-sage-900 uppercase">
                        {data.swiftCode}
                      </span>
                    </>
                  )}
                  {data.routingNumber && (
                    <>
                      <span className="text-gray-500">Routing No.</span>
                      <span className="font-medium text-sage-900">
                        {data.routingNumber}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {(bkashNumber || nagadNumber) && (
                <div className="bg-sage-50 rounded-[8px] p-4 space-y-2.5">
                  <p className="text-xs font-semibold text-sage-600 uppercase tracking-wide">
                    Mobile Banking
                  </p>
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    {bkashNumber && (
                      <>
                        <span className="text-gray-500">bKash</span>
                        <span className="font-medium text-sage-900 tracking-wide">
                          {bkashNumber}
                        </span>
                      </>
                    )}
                    {nagadNumber && (
                      <>
                        <span className="text-gray-500">Nagad</span>
                        <span className="font-medium text-sage-900 tracking-wide">
                          {nagadNumber}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* QR Code */}
              {data.qrCode && (
                <div className="flex justify-center">
                  <div className="image-protected w-40 h-40 rounded-[8px] overflow-hidden">
                    <Image
                      src={urlFor(data.qrCode).width(320).format("auto").quality("auto").url()}
                      alt="Donation QR Code"
                      width={160}
                      height={160}
                      className="object-contain no-select"
                      draggable={false}
                      sizes="160px"
                    />
                  </div>
                </div>
              )}

              {/* Rules */}
              {data.rules && data.rules.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-sage-600 uppercase tracking-wide mb-2">
                    Please Note
                  </p>
                  <ul className="space-y-1.5">
                    {data.rules.map((rule, i) => (
                      <li
                        key={i}
                        className="text-sm text-gray-600 flex gap-2 items-start"
                      >
                        <span className="text-sage-400 mt-0.5 shrink-0">
                          &bull;
                        </span>
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Close button */}
              <button
                onClick={closeModal}
                className="w-full py-2.5 rounded-[8px] border border-sage-200 text-sage-700 text-sm font-medium hover:bg-sage-50 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
