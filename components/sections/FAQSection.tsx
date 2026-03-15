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
    question: "How can I donate to the Farhana Afroz Foundation?",
    answer:
      "You can donate by clicking the 'Donate Now' button on our website. The donation modal provides bank transfer details, including SWIFT and Routing numbers for international and local contributions.",
    order: 1,
  },
  {
    _id: "faq2",
    question: "What are the primary focus areas of the foundation?",
    answer:
      "Our core focus areas include emergency flood relief, housing support for the homeless, distribution of winter clothing and Ramadan food programs, and providing education and medical assistance to those in need.",
    order: 2,
  },
  {
    _id: "faq3",
    question: "How does the foundation ensure transparency?",
    answer:
      "Transparency is one of our core values. We maintain honesty and accountability in all our activities, ensuring that all funds are distributed directly to welfare programs and relief campaigns.",
    order: 3,
  },
  {
    _id: "faq4",
    question: "Can I volunteer for disaster relief campaigns?",
    answer:
      "Absolutely! We have over 150 dedicated volunteers. If you wish to join our humanitarian efforts, please contact us through the Contact page.",
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
          <div className="text-left mb-10">
            <p className="section-kicker text-sage-600 mb-1">
              FAQ
            </p>
            <h2 className="text-[32px] md:text-[42px] font-bold text-sage-900 leading-tight">
              Frequently Asked <span className="bg-clip-text text-transparent bg-gradient-to-r from-sage-600 to-sage-400">Questions</span>
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="bg-white rounded-[12px] shadow-xl px-6 divide-y-0 transition-all duration-300 hover:shadow-2xl">
            {displayItems.map((item) => (
              <FAQAccordionItem key={item._id} item={item} />
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
