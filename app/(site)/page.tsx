import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import JourneyCarousel from "@/components/sections/JourneyCarousel";
import FeaturedEvents from "@/components/sections/FeaturedEvents";
import DonationHighlight from "@/components/sections/DonationHighlight";
import MissionSection from "@/components/sections/MissionSection";
import ImpactSection from "@/components/sections/ImpactSection";
import FAQSection from "@/components/sections/FAQSection";
import ContactStrip from "@/components/sections/ContactStrip";
import {
  getSiteSettings,
  getFeaturedEvents,
  getCarouselItems,
  getMission,
  getImpactItems,
  getFAQItems,
} from "@/sanity/lib/queries";
import { simulateDelay } from "@/lib/utils";

export const revalidate = 3600;

export default async function HomePage() {
  await simulateDelay();

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
      <ContactStrip />
    </>
  );
}
