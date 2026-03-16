import { createClient } from "@sanity/client";

const normalizeEnv = (value?: string) => value?.trim().replace(/^['"]|['"]$/g, "");

const projectId =
  normalizeEnv(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) ??
  normalizeEnv(process.env.SANITY_STUDIO_PROJECT_ID);
const dataset =
  normalizeEnv(process.env.NEXT_PUBLIC_SANITY_DATASET) ??
  normalizeEnv(process.env.SANITY_STUDIO_DATASET);
const sanityApiToken = normalizeEnv(process.env.SANITY_API_TOKEN);
const apiVersion = "2024-01-01";
const isProduction = process.env.NODE_ENV === "production";
const hasServerApiToken =
  typeof sanityApiToken === "string" && /^sk[A-Za-z0-9_-]+$/.test(sanityApiToken);

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

// Server-side read client for GROQ queries.
// Prefer token-based reads when a valid API token is present (private datasets).
// Fall back to unauthenticated reads for public datasets.
export const serverClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token: hasServerApiToken ? sanityApiToken : undefined,
  useCdn: isProduction && !hasServerApiToken,
});

// Authenticated server client for privileged operations (mutations, private datasets, etc.).
export const serverAuthClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token: hasServerApiToken ? sanityApiToken : undefined,
  useCdn: false,
});
