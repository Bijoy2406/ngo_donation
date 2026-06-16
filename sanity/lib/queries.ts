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

const CACHE_REVALIDATE_SECONDS = process.env.NODE_ENV === "production" ? 3600 : 1;

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
        bkashNumber,
        nagadNumber,
        email,
        phone,
        address,
        volunteerFormUrl
      }`);
    },
    ["site-settings"],
    { revalidate: CACHE_REVALIDATE_SECONDS, tags: ["siteSettings"] }
  )
);

export const getAllEvents = cache(
  unstable_cache(
    async (): Promise<Event[]> => {
      return serverClient.fetch(`*[_type == "event" && isOngoing != true] | order(date desc){
        _id,
        title,
        slug,
        shortDescription,
        thumbnail,
        date,
        featured,
        isOngoing
      }`);
    },
    ["all-events"],
    { revalidate: CACHE_REVALIDATE_SECONDS, tags: ["events"] }
  )
);

export const getOngoingEvents = cache(
  unstable_cache(
    async (): Promise<Event[]> => {
      return serverClient.fetch(`*[_type == "event" && isOngoing == true] | order(date desc){
        _id,
        title,
        slug,
        shortDescription,
        thumbnail,
        date,
        featured,
        isOngoing
      }`);
    },
    ["ongoing-events"],
    { revalidate: CACHE_REVALIDATE_SECONDS, tags: ["events"] }
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
    { revalidate: CACHE_REVALIDATE_SECONDS, tags: ["events"] }
  );
  return fetcher();
});

export const getTeamMembers = cache(
  unstable_cache(
    async (): Promise<TeamMember[]> => {
      return serverClient.fetch(`*[_type == "teamMember" && isAdvisor != true] | order(order asc){
        _id,
        name,
        role,
        image,
        order,
        isAdvisor
      }`);
    },
    ["team-members"],
    { revalidate: CACHE_REVALIDATE_SECONDS, tags: ["team"] }
  )
);

export const getAdvisors = cache(
  unstable_cache(
    async (): Promise<TeamMember[]> => {
      return serverClient.fetch(`*[_type == "teamMember" && isAdvisor == true] | order(order asc){
        _id,
        name,
        role,
        image,
        order,
        isAdvisor
      }`);
    },
    ["advisors"],
    { revalidate: CACHE_REVALIDATE_SECONDS, tags: ["team"] }
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
    { revalidate: CACHE_REVALIDATE_SECONDS, tags: ["mission"] }
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
    { revalidate: CACHE_REVALIDATE_SECONDS, tags: ["donation"] }
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
          bkashNumber,
          nagadNumber,
          email,
          phone,
          address,
          volunteerFormUrl
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
        "impactItems": *[_type in ["keyAchievementItem", "impactItem"]] | order(order asc){
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
      revalidate: CACHE_REVALIDATE_SECONDS,
      tags: ["siteSettings", "events", "carousel", "mission", "impact", "faq"],
    }
  )
);
