import ScrollReveal from "@/components/ui/ScrollReveal";
import TeamAdvisorToggle from "@/components/ui/TeamAdvisorToggle";
import { getTeamMembers, getAdvisors } from "@/sanity/lib/queries";
import { simulateDelay } from "@/lib/utils";

export const revalidate = 3600;

export const metadata = {
  title: "Our Team | Farzana Afroz Foundation",
  description:
    "Meet the dedicated individuals behind the Farzana Afroz Foundation.",
};

export default async function TeamPage() {
  await simulateDelay();
  const [members, advisors] = await Promise.all([getTeamMembers(), getAdvisors()]);

  return (
    <>
      {/* Hero */}
      <section className="pt-28 pb-12 bg-sage-50">
        <div className="max-w-6xl mx-auto px-5">
          <ScrollReveal>
            <p className="text-xs font-semibold text-sage-500 uppercase tracking-widest mb-2">
              People
            </p>
            <h1 className="text-[28px] md:text-[36px] font-bold text-sage-900">
              Our Team
            </h1>
            <p className="text-gray-500 text-sm md:text-base mt-3 max-w-xl leading-relaxed">
              Behind every initiative is a group of passionate individuals
              committed to creating meaningful change in communities.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Team / Advisors Grid */}
      <section className="py-[60px] bg-white">
        <div className="max-w-6xl mx-auto px-5">
          <TeamAdvisorToggle members={members} advisors={advisors} />
        </div>
      </section>
    </>
  );
}
