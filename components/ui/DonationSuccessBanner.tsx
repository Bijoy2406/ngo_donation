"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { m, AnimatePresence, LazyMotion, domAnimation } from "framer-motion";
import { HiCheckCircle, HiX } from "react-icons/hi";

export default function DonationSuccessBanner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [tran_id, setTranId] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (searchParams.get("donated") === "true") {
      setTranId(searchParams.get("tran_id") || "");
      setAmount(searchParams.get("amount") || "");
      setVisible(true);

      // Clean params from URL without page reload
      const clean = new URL(window.location.href);
      clean.searchParams.delete("donated");
      clean.searchParams.delete("tran_id");
      clean.searchParams.delete("amount");
      router.replace(clean.pathname + (clean.search || ""), { scroll: false });

      // Auto-dismiss after 8s
      const t = setTimeout(() => setVisible(false), 8000);
      return () => clearTimeout(t);
    }
  }, [searchParams, router, pathname]);

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {visible && (
          <m.div
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[300] w-[calc(100%-2rem)] max-w-md"
          >
            <div className="bg-sage-700 text-white rounded-[12px] shadow-[0_12px_32px_rgba(24,58,50,0.45)] px-5 py-4 flex items-start gap-3">
              <HiCheckCircle className="shrink-0 mt-0.5 w-5 h-5 text-sage-200" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">Thank you for your donation!</p>
                <p className="text-sage-200 text-xs mt-0.5">
                  {amount ? `৳${parseFloat(amount).toLocaleString()} received` : "Payment confirmed"}
                  {tran_id ? ` · ID: ${tran_id}` : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setVisible(false)}
                className="shrink-0 mt-0.5 text-sage-300 hover:text-white transition-colors"
                aria-label="Dismiss"
              >
                <HiX size={16} />
              </button>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}
