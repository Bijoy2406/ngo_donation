"use client";

import { useEffect, useState } from "react";
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import { HiX } from "react-icons/hi";
import { useDonationModal } from "@/lib/context/DonationModalContext";
import { cn } from "@/lib/utils";

const PRESET_AMOUNTS = [500, 1000, 2000, 5000];

export default function DonationModal() {
  const { isOpen, closeModal } = useDonationModal();

  const [selectedAmount, setSelectedAmount] = useState<number | null>(1000);
  const [customAmount, setCustomAmount] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const finalAmount = selectedAmount ?? (customAmount ? Number(customAmount) : 0);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeModal(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [closeModal]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedAmount(1000);
      setCustomAmount("");
      setName("");
      setEmail("");
      setPhone("");
      setAddress("");
      setError("");
      setLoading(false);
    }
  }, [isOpen]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!finalAmount || finalAmount < 10) {
      setError("Minimum donation amount is ৳10.");
      return;
    }
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/payment/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: finalAmount, name, email, phone, address, returnUrl: window.location.pathname }),
      });
      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error ?? "Something went wrong. Please try again.");
        setLoading(false);
      }
    } catch {
      setError("Network error. Please check your connection.");
      setLoading(false);
    }
  }

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
              initial={{ scale: 0.95, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 24 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="bg-[#faf6f0] w-full sm:max-w-md rounded-t-[20px] sm:rounded-[16px] max-h-[92dvh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-[#faf6f0]/95 backdrop-blur-sm flex items-start justify-between px-6 pt-5 pb-4 border-b border-[#e8ddd0]">
                <div>
                  <h2 className="text-lg font-bold text-sage-900">Make a Donation</h2>
                  <p className="text-sm text-sage-600 mt-0.5">Secure payment via SSLCommerz</p>
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

              <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
                {/* Amount selection */}
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

                {/* Donor info */}
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

                {/* Submit */}
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
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}
