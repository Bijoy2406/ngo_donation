import imageUrlBuilder from "@sanity/image-url";
import { client } from "./client";
import type { CMSImage } from "@/types";

const builder = imageUrlBuilder(client);

// ---------------------------------------------------------------------------
// Unified image builder interface — both Cloudinary and Sanity return this
// ---------------------------------------------------------------------------

interface ImageBuilder {
  width(value: number): ImageBuilder;
  height(value: number): ImageBuilder;
  format(value: string): ImageBuilder;
  quality(value: number | string): ImageBuilder;
  url(): string;
}

// ---------------------------------------------------------------------------
// Cloudinary implementation
// ---------------------------------------------------------------------------

class CloudinaryUrlBuilder implements ImageBuilder {
  private readonly baseUrl: string;
  private widthValue?: number;
  private heightValue?: number;
  private formatValue?: string;
  private qualityValue?: number | string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  width(value: number) {
    this.widthValue = value;
    return this;
  }

  height(value: number) {
    this.heightValue = value;
    return this;
  }

  format(value: string) {
    this.formatValue = value;
    return this;
  }

  quality(value: number | string) {
    this.qualityValue = value;
    return this;
  }

  /** Returns a tiny blurred placeholder URL (~200 bytes) for use as blurDataURL */
  blurUrl() {
    const transforms = "w_20,q_1,e_blur:1000,f_webp";
    const marker = "/upload/";
    const markerIndex = this.baseUrl.indexOf(marker);
    if (markerIndex === -1) return this.baseUrl;
    const insertPosition = markerIndex + marker.length;
    return `${this.baseUrl.slice(0, insertPosition)}${transforms}/${this.baseUrl.slice(insertPosition)}`;
  }

  url() {
    const transforms: string[] = [];

    if (this.widthValue) transforms.push(`w_${this.widthValue}`);
    if (this.heightValue) transforms.push(`h_${this.heightValue}`);
    if (this.qualityValue !== undefined) transforms.push(`q_${this.qualityValue}`);
    if (this.formatValue) transforms.push(`f_${this.formatValue}`);

    if (transforms.length === 0) return this.baseUrl;

    const marker = "/upload/";
    const markerIndex = this.baseUrl.indexOf(marker);
    if (markerIndex === -1) return this.baseUrl;

    const transformString = `${transforms.join(",")}/`;
    const insertPosition = markerIndex + marker.length;
    return `${this.baseUrl.slice(0, insertPosition)}${transformString}${this.baseUrl.slice(insertPosition)}`;
  }
}

// ---------------------------------------------------------------------------
// Sanity adapter — maps the unified interface to @sanity/image-url builder
// ---------------------------------------------------------------------------

const QUALITY_MAP: Record<string, number> = {
  "auto": 80,
  "auto:good": 80,
  "auto:best": 90,
  "auto:eco": 60,
  "auto:low": 40,
};

const FORMAT_MAP: Record<string, "jpg" | "pjpg" | "png" | "webp"> = {
  auto: "webp",
  avif: "webp", // Sanity doesn't support AVIF, fallback to webp
  jpg: "jpg",
  jpeg: "jpg",
  png: "png",
  webp: "webp",
};

class SanityUrlBuilderAdapter implements ImageBuilder {
  private inner: ReturnType<typeof builder.image>;

  constructor(source: Extract<CMSImage, { _type: "image" }>) {
    this.inner = builder.image(source);
  }

  width(value: number) {
    this.inner = this.inner.width(value);
    return this;
  }

  height(value: number) {
    this.inner = this.inner.height(value);
    return this;
  }

  format(value: string) {
    const mapped = FORMAT_MAP[value] ?? "webp";
    this.inner = this.inner.format(mapped);
    return this;
  }

  quality(value: number | string) {
    const q = typeof value === "string" ? (QUALITY_MAP[value] ?? 80) : value;
    this.inner = this.inner.quality(q);
    return this;
  }

  url() {
    return this.inner.url();
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

function isCloudinaryAsset(source: CMSImage): source is Extract<CMSImage, { _type: "cloudinary.asset" }> {
  return source._type === "cloudinary.asset";
}

export function urlFor(source: CMSImage): ImageBuilder {
  if (isCloudinaryAsset(source)) {
    const cloudinaryUrl = source.secure_url ?? source.url;
    if (!cloudinaryUrl) {
      throw new Error("Cloudinary asset is missing both secure_url and url.");
    }
    return new CloudinaryUrlBuilder(cloudinaryUrl);
  }

  return new SanityUrlBuilderAdapter(source as Extract<CMSImage, { _type: "image" }>);
}

/**
 * Returns a tiny blurred placeholder URL for any CMS image.
 * Use as the `blurDataURL` prop on next/image with `placeholder="blur"`.
 */
export function getBlurUrl(source: CMSImage): string {
  if (isCloudinaryAsset(source)) {
    const cloudinaryUrl = source.secure_url ?? source.url;
    if (!cloudinaryUrl) return "";
    return new CloudinaryUrlBuilder(cloudinaryUrl).blurUrl();
  }
  // Sanity images — use the builder to generate a tiny blurred version
  return builder.image(source).width(20).quality(1).blur(50).format("webp").url();
}
