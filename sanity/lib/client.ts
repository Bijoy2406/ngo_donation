import { createClient } from "@sanity/client";

const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ??
  process.env.SANITY_STUDIO_PROJECT_ID;
const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ??
  process.env.SANITY_STUDIO_DATASET;
const apiVersion = "2024-01-01";
const isProduction = process.env.NODE_ENV === "production";

if (!projectId || !dataset) {
  throw new Error(
    "Missing Sanity environment variables. Set NEXT_PUBLIC_SANITY_PROJECT_ID/NEXT_PUBLIC_SANITY_DATASET or SANITY_STUDIO_PROJECT_ID/SANITY_STUDIO_DATASET."
  );
}

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: isProduction,
});


// Server-only client with write token — never import in client components
export const serverClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token: process.env.SANITY_API_TOKEN,
  // In local/dev we disable CDN so Studio publishes are reflected immediately.
  useCdn: isProduction,
});
