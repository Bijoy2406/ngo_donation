import imageUrlBuilder from "@sanity/image-url";
import { client } from "./client";
import type { CMSImage } from "@/types";

const builder = imageUrlBuilder(client);

class CloudinaryUrlBuilder {
  private readonly baseUrl: string;
  private widthValue?: number;
  private heightValue?: number;
  private formatValue?: string;
  private qualityValue?: number;

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

  quality(value: number) {
    this.qualityValue = value;
    return this;
  }

  url() {
    const transforms: string[] = [];

    if (this.widthValue) transforms.push(`w_${this.widthValue}`);
    if (this.heightValue) transforms.push(`h_${this.heightValue}`);
    if (this.qualityValue) transforms.push(`q_${this.qualityValue}`);
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

function isCloudinaryAsset(source: CMSImage): source is Extract<CMSImage, { _type: "cloudinary.asset" }> {
  return source._type === "cloudinary.asset";
}

export function urlFor(source: CMSImage) {
  if (isCloudinaryAsset(source)) {
    const cloudinaryUrl = source.secure_url ?? source.url;
    if (!cloudinaryUrl) {
      throw new Error("Cloudinary asset is missing both secure_url and url.");
    }
    return new CloudinaryUrlBuilder(cloudinaryUrl);
  }

  return builder.image(source);
}
