"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HiPlus, HiMinus } from "react-icons/hi";
import ScrollReveal from "@/components/ui/ScrollReveal";
import type { FAQItem } from "@/types";

interface FAQSectionProps {
  items: FAQItem[];
}

const defaultItems: FAQItem[] = [
  {
    _id: "faq1",
    question: "How can I donate to the Foundation?",
    answer:
      "You can donate by clicking the 'Donate Now' button anywhere on our site. The donation modal provides bank transfer details and a QR code for your convenience.",
    order: 1,
  },
  {
    _id: "faq2",
    question: "How are donations used?",
    answer:
      "All donations are directed toward our core programs: educational scholarships, healthcare camps, and community development initiatives. We publish annual impact reports for full transparency.",
    order: 2,
  },
  {
    _id: "faq3",
    question: "Can I volunteer with the Foundation?",
    answer:
      "Yes! We welcome volunteers. Please reach out via our Contact page and our team will guide you through the volunteer onboarding process.",
    order: 3,
  },
  {
    _id: "faq4",
    question: "How can my organization partner with you?",
    answer:
      "We are open to partnerships with organizations that share our values. Contact us through the Contact page or email us directly for collaboration inquiries.",
    order: 4,
  },
];

function FAQAccordionItem({ item }: { item: FAQItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-sage-100 last:border-0">
      <button
        className="w-full flex items-center justify-between py-5 text-left gap-4 group"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="text-sm md:text-base font-semibold text-sage-900 leading-snug group-hover:text-sage-600 transition-colors">
          {item.question}
        </span>
        <span className="shrink-0 w-7 h-7 rounded-full bg-sage-100 group-hover:bg-sage-200 transition-colors flex items-center justify-center text-sage-600">
          {isOpen ? <HiMinus size={14} /> : <HiPlus size={14} />}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm text-gray-500 leading-relaxed pr-10">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQSection({ items }: FAQSectionProps) {
  const displayItems = items.length > 0 ? items : defaultItems;

  return (
    <section className="py-[60px] bg-sage-50">
      <div className="max-w-4xl mx-auto px-5">
        <ScrollReveal>
          <div className="text-right mb-8">
            <p className="text-xs font-semibold text-sage-500 uppercase tracking-widest mb-1">
              FAQ
            </p>
            <h2 className="text-[22px] md:text-[26px] font-bold text-sage-900">
              Frequently Asked Questions
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="bg-white rounded-[8px] shadow-card px-6 divide-y-0">
            {displayItems.map((item) => (
              <FAQAccordionItem key={item._id} item={item} />
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
