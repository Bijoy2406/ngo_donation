export interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
  alt?: string;
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
}

export interface CloudinaryAssetImage {
  _type: "cloudinary.asset";
  secure_url?: string;
  url?: string;
}

export type CMSImage = SanityImage | CloudinaryAssetImage;

export interface SiteSettings {
  _id: string;
  heroHeading: string;
  heroSubheading: string;
  heroImage?: CMSImage;
  aboutHeading: string;
  aboutDescription: string;
  totalEvents: number;
  peopleEngaged: number;
  yearsActive: number;
  instagramUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  whatsappNumber?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface Event {
  _id: string;
  title: string;
  slug: { current: string };
  shortDescription: string;
  description: PortableTextBlock[];
  thumbnail: CMSImage;
  gallery?: CMSImage[];
  date: string;
  featured: boolean;
  featuredOrder?: number;
}

export interface TeamMember {
  _id: string;
  name: string;
  role: string;
  image: CMSImage;
  order: number;
}

export interface CarouselItem {
  _id: string;
  heading: string;
  subheading: string;
  image: CMSImage;
  order: number;
}

export interface MissionSection {
  _id: string;
  heading: string;
  description: PortableTextBlock[];
  image: CMSImage;
}

export interface ImpactItem {
  _id: string;
  icon: string;
  heading: string;
  description: string;
  order: number;
}

export interface FAQItem {
  _id: string;
  question: string;
  answer: string;
  order: number;
}

export interface DonationSettings {
  _id: string;
  heading: string;
  description: string;
  rules: string[];
  bankName: string;
  accountName: string;
  accountNumber: string;
  swiftCode?: string;
  routingNumber?: string;
  branchName?: string;
  qrCode?: CMSImage;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PortableTextBlock = any;
