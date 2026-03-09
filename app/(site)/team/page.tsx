import TeamCard from "@/components/ui/TeamCard";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { getTeamMembers } from "@/sanity/lib/queries";

export const revalidate = 3600;

export const metadata = {
  title: "Our Team | Farzana Afroz Foundation",
  description:
    "Meet the dedicated individuals behind the Farzana Afroz Foundation.",
};

export default async function TeamPage() {
  const members = await getTeamMembers();

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

      {/* Team Grid */}
      <section className="py-[60px] bg-white">
        <div className="max-w-6xl mx-auto px-5">
          {members.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {[1, 2, 3, 4].map((i) => (
                <SkeletonCard key={i} aspect="square" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {members.map((member, i) => (
                <ScrollReveal key={member._id} delay={i * 0.07}>
                  <TeamCard member={member} />
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
