import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legal & Policy | Farhana Afroz Foundation",
  description: "Legal information and policies of the Farhana Afroz Foundation.",
};

export default function LegalPolicyPage() {
  return (
    <main className="min-h-screen bg-[#faf5ec] pt-28 pb-20 px-5">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-sage-900 mb-3">
          Legal &amp; Policy
        </h1>
        <p className="text-sage-600 text-base leading-relaxed">
          This page will contain our legal information and policies. Content coming soon.
        </p>
      </div>
    </main>
  );
}
