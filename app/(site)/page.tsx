import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import JourneyCarousel from "@/components/sections/JourneyCarousel";
import FeaturedEvents from "@/components/sections/FeaturedEvents";
import DonationHighlight from "@/components/sections/DonationHighlight";
import MissionSection from "@/components/sections/MissionSection";
import ImpactSection from "@/components/sections/ImpactSection";
import FAQSection from "@/components/sections/FAQSection";
import {
  getSiteSettings,
  getFeaturedEvents,
  getCarouselItems,
  getMission,
  getImpactItems,
  getFAQItems,
} from "@/sanity/lib/queries";

export const revalidate = 3600;

export default async function HomePage() {
  const [settings, featuredEvents, carouselItems, mission, impactItems, faqItems] =
    await Promise.all([
      getSiteSettings(),
      getFeaturedEvents(),
      getCarouselItems(),
      getMission(),
      getImpactItems(),
      getFAQItems(),
    ]);

  return (
    <>
      <HeroSection settings={settings} />
      <AboutSection settings={settings} />
      <JourneyCarousel items={carouselItems} />
      <FeaturedEvents events={featuredEvents} />
      <DonationHighlight />
      <MissionSection mission={mission} />
      <ImpactSection items={impactItems} />
      <FAQSection items={faqItems} />
    </>
  );
}
