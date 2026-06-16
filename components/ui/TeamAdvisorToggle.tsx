"use client";

import { useState } from "react";
import TeamCard from "@/components/ui/TeamCard";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import type { TeamMember } from "@/types";

interface TeamAdvisorToggleProps {
  members: TeamMember[];
  advisors: TeamMember[];
}

export default function TeamAdvisorToggle({ members, advisors }: TeamAdvisorToggleProps) {
  const [tab, setTab] = useState<"team" | "advisors">("team");

  const list = tab === "team" ? members : advisors;
  const isEmpty = list.length === 0;

  return (
    <>
      {/* Toggle */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex bg-sage-100 rounded-full p-1 gap-1">
          <button
            type="button"
            onClick={() => setTab("team")}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
              tab === "team"
                ? "bg-sage-600 text-white shadow-sm"
                : "text-sage-600 hover:text-sage-800"
            }`}
          >
            Team
          </button>
          <button
            type="button"
            onClick={() => setTab("advisors")}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
              tab === "advisors"
                ? "bg-sage-600 text-white shadow-sm"
                : "text-sage-600 hover:text-sage-800"
            }`}
          >
            Advisors
          </button>
        </div>
      </div>

      {/* Grid */}
      {isEmpty ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} aspect="square" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {list.map((person, i) => (
            <ScrollReveal key={person._id} delay={i * 0.07}>
              <TeamCard member={person} />
            </ScrollReveal>
          ))}
        </div>
      )}
    </>
  );
}
