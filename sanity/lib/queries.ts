import { client } from "./client";
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

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return client.fetch(`*[_type == "siteSettings"][0]{
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
}

export async function getFeaturedEvents(): Promise<Event[]> {
  return client.fetch(`*[_type == "event" && featured == true] | order(featuredOrder asc)[0...4]{
    _id,
    title,
    slug,
    shortDescription,
    thumbnail,
    date
  }`);
}

export async function getAllEvents(): Promise<Event[]> {
  return client.fetch(`*[_type == "event"] | order(date desc){
    _id,
    title,
    slug,
    shortDescription,
    thumbnail,
    date,
    featured
  }`);
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  return client.fetch(
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
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  return client.fetch(`*[_type == "teamMember"] | order(order asc){
    _id,
    name,
    role,
    image,
    order
  }`);
}

export async function getCarouselItems(): Promise<CarouselItem[]> {
  return client.fetch(`*[_type == "carouselItem"] | order(order asc){
    _id,
    heading,
    subheading,
    image,
    order
  }`);
}

export async function getMission(): Promise<MissionSection | null> {
  return client.fetch(`*[_type == "missionSection"][0]{
    _id,
    heading,
    description,
    image
  }`);
}

export async function getImpactItems(): Promise<ImpactItem[]> {
  return client.fetch(`*[_type == "impactItem"] | order(order asc){
    _id,
    icon,
    heading,
    description,
    order
  }`);
}

export async function getFAQItems(): Promise<FAQItem[]> {
  return client.fetch(`*[_type == "faqItem"] | order(order asc){
    _id,
    question,
    answer,
    order
  }`);
}

export async function getDonationSettings(): Promise<DonationSettings | null> {
  return client.fetch(`*[_type == "donationSettings"][0]{
    _id,
    heading,
    description,
    rules,
    bankName,
    accountName,
    accountNumber,
    qrCode
  }`);
}
