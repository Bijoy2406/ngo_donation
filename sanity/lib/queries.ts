import { cache } from "react";
import { unstable_cache } from "next/cache";
import { serverClient } from "./client";
import type {
  SiteSettings,
  Event,
  TeamMember,
  CarouselItem,
  MissionSection,
  ImpactItem,
  FAQItem,
  DonationSettings,
} from "@/types";

// ---------------------------------------------------------------------------
// Individual cached query functions
// ---------------------------------------------------------------------------
// Each function is wrapped with:
//   1. unstable_cache  – cross-request server cache with tag-based invalidation
//   2. React.cache     – same-request dedup (e.g. layout + page both call getSiteSettings)

export const getSiteSettings = cache(
  unstable_cache(
    async (): Promise<SiteSettings | null> => {
      return serverClient.fetch(`*[_type == "siteSettings"][0]{
        _id,
        heroHeading,
        heroSubheading,
        heroImage,
        aboutHeading,
        aboutDescription,
        totalEvents,
        peopleEngaged,
        yearsActive,
        instagramUrl,
        facebookUrl,
        twitterUrl,
        whatsappNumber,
        email,
        phone,
        address
      }`);
    },
    ["site-settings"],
    { revalidate: 3600, tags: ["siteSettings"] }
  )
);

export const getFeaturedEvents = cache(
  unstable_cache(
    async (): Promise<Event[]> => {
      return serverClient.fetch(`*[_type == "event" && featured == true] | order(featuredOrder asc)[0...4]{
        _id,
        title,
        slug,
        shortDescription,
        thumbnail,
        date
      }`);
    },
    ["featured-events"],
    { revalidate: 3600, tags: ["events"] }
  )
);

export const getAllEvents = cache(
  unstable_cache(
    async (): Promise<Event[]> => {
      return serverClient.fetch(`*[_type == "event"] | order(date desc){
        _id,
        title,
        slug,
        shortDescription,
        thumbnail,
        date,
        featured
      }`);
    },
    ["all-events"],
    { revalidate: 3600, tags: ["events"] }
  )
);

export const getEventBySlug = cache(async (slug: string): Promise<Event | null> => {
  const fetcher = unstable_cache(
    async (): Promise<Event | null> => {
      return serverClient.fetch(
        `*[_type == "event" && slug.current == $slug][0]{
          _id,
          title,
          slug,
          shortDescription,
          description,
          thumbnail,
          gallery,
          date
        }`,
        { slug }
      );
    },
    ["event", slug],
    { revalidate: 3600, tags: ["events"] }
  );
  return fetcher();
});

export const getTeamMembers = cache(
  unstable_cache(
    async (): Promise<TeamMember[]> => {
      return serverClient.fetch(`*[_type == "teamMember"] | order(order asc){
        _id,
        name,
        role,
        image,
        order
      }`);
    },
    ["team-members"],
    { revalidate: 3600, tags: ["team"] }
  )
);

export const getCarouselItems = cache(
  unstable_cache(
    async (): Promise<CarouselItem[]> => {
      return serverClient.fetch(`*[_type == "carouselItem"] | order(order asc){
        _id,
        heading,
        subheading,
        image,
        order
      }`);
    },
    ["carousel-items"],
    { revalidate: 3600, tags: ["carousel"] }
  )
);

export const getMission = cache(
  unstable_cache(
    async (): Promise<MissionSection | null> => {
      return serverClient.fetch(`*[_type == "missionSection"][0]{
        _id,
        heading,
        description,
        image
      }`);
    },
    ["mission"],
    { revalidate: 3600, tags: ["mission"] }
  )
);

export const getImpactItems = cache(
  unstable_cache(
    async (): Promise<ImpactItem[]> => {
      return serverClient.fetch(`*[_type == "impactItem"] | order(order asc){
        _id,
        icon,
        heading,
        description,
        order
      }`);
    },
    ["impact-items"],
    { revalidate: 3600, tags: ["impact"] }
  )
);

export const getFAQItems = cache(
  unstable_cache(
    async (): Promise<FAQItem[]> => {
      return serverClient.fetch(`*[_type == "faqItem"] | order(order asc){
        _id,
        question,
        answer,
        order
      }`);
    },
    ["faq-items"],
    { revalidate: 3600, tags: ["faq"] }
  )
);

export const getDonationSettings = cache(
  unstable_cache(
    async (): Promise<DonationSettings | null> => {
      return serverClient.fetch(`*[_type == "donationSettings"][0]{
        _id,
        heading,
        description,
        rules,
        bankName,
        accountName,
        accountNumber,
        qrCode
      }`);
    },
    ["donation-settings"],
    { revalidate: 3600, tags: ["donation"] }
  )
);

// ---------------------------------------------------------------------------
// Merged homepage query — fetches ALL homepage data in a single GROQ request
// ---------------------------------------------------------------------------

interface HomePageData {
  settings: SiteSettings | null;
  featuredEvents: Event[];
  carouselItems: CarouselItem[];
  mission: MissionSection | null;
  impactItems: ImpactItem[];
  faqItems: FAQItem[];
}

export const getHomePageData = cache(
  unstable_cache(
    async (): Promise<HomePageData> => {
      return serverClient.fetch(`{
        "settings": *[_type == "siteSettings"][0]{
          _id,
          heroHeading,
          heroSubheading,
          heroImage,
          aboutHeading,
          aboutDescription,
          totalEvents,
          peopleEngaged,
          yearsActive,
          instagramUrl,
          facebookUrl,
          twitterUrl,
          whatsappNumber,
          email,
          phone,
          address
        },
        "featuredEvents": *[_type == "event" && featured == true] | order(featuredOrder asc)[0...4]{
          _id,
          title,
          slug,
          shortDescription,
          thumbnail,
          date
        },
        "carouselItems": *[_type == "carouselItem"] | order(order asc){
          _id,
          heading,
          subheading,
          image,
          order
        },
        "mission": *[_type == "missionSection"][0]{
          _id,
          heading,
          description,
          image
        },
        "impactItems": *[_type == "impactItem"] | order(order asc){
          _id,
          icon,
          heading,
          description,
          order
        },
        "faqItems": *[_type == "faqItem"] | order(order asc){
          _id,
          question,
          answer,
          order
        }
      }`);
    },
    ["home-page-data"],
    {
      revalidate: 3600,
      tags: ["siteSettings", "events", "carousel", "mission", "impact", "faq"],
    }
  )
);
