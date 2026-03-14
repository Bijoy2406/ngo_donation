# Performance Optimization Guide

> Farzana Afroz Foundation — Next.js 15 + Sanity CMS + Cloudinary
> Generated: March 2026

---

## Table of Contents

1. [Reduce API / Sanity Calls](#1-reduce-api--sanity-calls)
2. [Caching Strategy](#2-caching-strategy)
3. [Cloudinary Image Optimization](#3-cloudinary-image-optimization)
4. [Next.js Image Component Tuning](#4-nextjs-image-component-tuning)
5. [Bundle & JavaScript Optimization](#5-bundle--javascript-optimization)
6. [HTTP Headers & CDN](#6-http-headers--cdn)
7. [Core Web Vitals Fixes](#7-core-web-vitals-fixes)
8. [Quick Win Checklist](#8-quick-win-checklist)

---

## 1. Reduce API / Sanity Calls

### Problem: Too many Sanity queries per page load

**Current state:**

| Location | Queries | When |
|----------|---------|------|
| `app/(site)/layout.tsx` | 2 (`getDonationSettings` + `getSiteSettings`) | Every page render |
| `app/(site)/page.tsx` | 6 (settings, featured events, carousel, mission, impact, FAQ) | Homepage revalidation |
| `app/(site)/events/page.tsx` | 1 (`getAllEvents`) | Events page revalidation |
| `app/(site)/events/[slug]/page.tsx` | 1-2 (`getEventBySlug` + `getAllEvents` for `generateStaticParams`) | Per event page |
| `app/(site)/team/page.tsx` | 1 (`getTeamMembers`) | Team page revalidation |

That is **8 queries on the homepage** alone (6 from page + 2 from layout). And `getSiteSettings()` is called in **both** `layout.tsx` and `page.tsx` — a duplicate.

### Fix 1: Deduplicate with `React.cache()`

Next.js automatically deduplicates `fetch()` calls in the same render pass, but `sanity.client.fetch()` is NOT a native `fetch()` — it does **not** get deduped. Wrap every query function with `React.cache()`:

```ts
// sanity/lib/queries.ts
import { cache } from "react";

export const getSiteSettings = cache(async () => {
  return serverClient.fetch<SiteSettings>(siteSettingsQuery);
});

export const getFeaturedEvents = cache(async () => {
  return serverClient.fetch<Event[]>(featuredEventsQuery);
});

// ... do this for ALL query functions
```

**Impact:** `getSiteSettings()` called in layout AND page will only hit Sanity **once** per render. Zero code changes needed in components — same function signature.

### Fix 2: Merge related queries into a single GROQ call

Instead of 6 separate Sanity queries on the homepage, combine them into **one** query:

```groq
{
  "settings": *[_type == "siteSettings"][0]{ ... },
  "featuredEvents": *[_type == "event" && featured == true] | order(featuredOrder asc)[0...4]{ ... },
  "carousel": *[_type == "carouselItem"] | order(order asc){ ... },
  "mission": *[_type == "missionSection"][0]{ ... },
  "impact": *[_type == "impactItem"] | order(order asc){ ... },
  "faq": *[_type == "faqItem"] | order(order asc){ ... }
}
```

This is a **single HTTP request** instead of 6. GROQ supports projections into named keys in one query.

**Impact:** Homepage goes from 6+2 queries down to **1+1** (combined page query + layout query). You could even merge the layout query into this one to get it down to a **single query**.

### Fix 3: Enable Sanity CDN for read queries

**File:** `sanity/lib/client.ts`

Currently `serverClient` has `useCdn: false`. Since you already use ISR with webhook revalidation, you can safely enable CDN:

```ts
export const serverClient = createClient({
  ...
  useCdn: true,   // <-- change from false to true
  token: process.env.SANITY_API_TOKEN,
});
```

Sanity's CDN caches responses globally at edge. Combined with your webhook-based revalidation (`/api/revalidate`), stale data gets purged on publish anyway. This alone can cut response times from ~200-400ms to ~20-50ms per query.

**If you need guaranteed fresh data** (e.g., draft previews), keep a separate `previewClient` with `useCdn: false` and only use it in preview mode.

### Fix 4: Stop fetching layout data on every page

`layout.tsx` calls `getDonationSettings()` + `getSiteSettings()` **every time any page renders**. Since layout data rarely changes:

**Option A:** Move layout data fetching to the homepage `page.tsx` and pass it via a shared server-side cache (using `unstable_cache` — see Section 2).

**Option B:** Use `React.cache()` (Fix 1) so that when the layout and page both call `getSiteSettings()`, it only executes once per request.

---

## 2. Caching Strategy

### Current state

- `revalidate = 3600` (1-hour ISR) on all pages
- Webhook-based on-demand revalidation via `/api/revalidate`
- No `unstable_cache`, no `React.cache()`, no HTTP cache headers
- No client-side caching (no SWR, no React Query)

### Recommendation: Three-layer caching

#### Layer 1: Request-level dedup — `React.cache()`

Already described in Section 1, Fix 1. This prevents the same query from running twice in a single request/render cycle.

#### Layer 2: Cross-request server cache — `unstable_cache`

`unstable_cache` (stable in Next.js 15 despite the name) caches data **across requests** on the server. It respects `revalidateTag()`:

```ts
import { unstable_cache } from "next/cache";

export const getSiteSettings = unstable_cache(
  async () => {
    return serverClient.fetch<SiteSettings>(siteSettingsQuery);
  },
  ["site-settings"],          // cache key
  {
    revalidate: 3600,          // TTL in seconds
    tags: ["siteSettings"],    // for on-demand invalidation
  }
);
```

Then update your `/api/revalidate` webhook to use `revalidateTag()` instead of `revalidatePath()`:

```ts
// Instead of revalidatePath("/") which only clears page cache
import { revalidateTag } from "next/cache";

// When siteSettings is updated in Sanity:
revalidateTag("siteSettings");
```

**Why this is better:** `revalidatePath` only invalidates the page-level ISR cache. `revalidateTag` invalidates the **data cache** — so the next request fetches fresh data from Sanity and then ISR re-renders the page with it.

#### Layer 3: HTTP cache headers for static assets

Add cache headers in `next.config.ts`:

```ts
const nextConfig: NextConfig = {
  images: { ... },
  async headers() {
    return [
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/image/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};
```

This tells browsers and CDNs (Vercel Edge) to cache static JS/CSS for 1 year (they're content-hashed) and optimized images for 1 week with stale-while-revalidate.

### Tag-based revalidation mapping

Update `/api/revalidate/route.ts` to use tags:

| Sanity `_type` | Tags to invalidate |
|---|---|
| `siteSettings` | `"siteSettings"` |
| `event` | `"events"`, `"featuredEvents"` |
| `teamMember` | `"team"` |
| `carouselItem` | `"carousel"` |
| `missionSection` | `"mission"` |
| `impactItem` | `"impact"` |
| `faqItem` | `"faq"` |
| `donationSettings` | `"donation"` |

---

## 3. Cloudinary Image Optimization

### Problem: Only using WebP, missing AVIF

**File:** `sanity/lib/image.ts`

Currently every image URL is built with `.format("webp")`. AVIF provides **20-30% smaller file sizes** than WebP at the same visual quality.

### Fix 1: Default to AVIF with WebP fallback

Cloudinary supports `f_auto` which serves the **best format the browser supports** (AVIF > WebP > JPEG):

```ts
// In CloudinaryUrlBuilder
format(fmt: string) {
  this.transforms.push(`f_${fmt}`);
  return this;
}
```

Change all `.format("webp")` calls to `.format("auto")`:

```ts
// Before
urlFor(settings.heroImage).width(1920).format("webp").quality(80).url()

// After
urlFor(settings.heroImage).width(1920).format("auto").quality(auto).url()
```

Cloudinary's `f_auto` will:
- Serve **AVIF** to Chrome 100+, Firefox 93+, Edge 100+
- Serve **WebP** to Safari 14+, older Chrome/Firefox
- Serve **JPEG** to legacy browsers

### Fix 2: Use `q_auto` instead of fixed quality

Instead of hardcoding `.quality(80)`, use Cloudinary's `q_auto`:

```
q_auto        — Cloudinary picks optimal quality (usually 60-80)
q_auto:good   — slightly higher quality
q_auto:best   — highest quality, still compressed
q_auto:low    — aggressive compression
q_auto:eco    — balanced size/quality
```

Recommended: `q_auto:good` for hero/carousel images, `q_auto:eco` for thumbnails and gallery.

**File size comparison (typical 1920px hero image):**

| Format | Quality | Approx Size |
|--------|---------|-------------|
| JPEG | 80 | ~350 KB |
| WebP | 80 | ~220 KB |
| AVIF | auto | ~140 KB |
| AVIF | auto:eco | ~90 KB |

### Fix 3: Add responsive breakpoints

Instead of serving a single 1920px image to all devices, use Cloudinary's responsive transformations:

```
/upload/w_auto,dpr_auto,f_auto,q_auto/image.jpg
```

Or better — specify explicit widths and let Next.js `<Image>` `sizes` prop + `srcSet` handle it. Update `next.config.ts`:

```ts
images: {
  remotePatterns: [...],
  formats: ["image/avif", "image/webp"],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
},
```

### Fix 4: Add Cloudinary eager transformations

For critical images (hero, first carousel slide), pre-generate optimized versions in Cloudinary instead of transforming on first request:

In your Sanity schema or upload hook, configure eager transformations:
```
eager: [
  { width: 1920, format: "avif", quality: "auto" },
  { width: 1080, format: "avif", quality: "auto" },
  { width: 640, format: "avif", quality: "auto" },
]
```

This way the first visitor doesn't wait for on-the-fly transformation.

### Fix 5: Use `c_limit` instead of `c_fill` for large images

Add crop mode to the CloudinaryUrlBuilder. For hero images, `c_limit` preserves aspect ratio and caps at max dimensions without upscaling:

```
/upload/w_1920,c_limit,f_auto,q_auto/image.jpg
```

For thumbnails (EventCard, TeamCard), `c_fill` with gravity is better:
```
/upload/w_400,h_400,c_fill,g_face,f_auto,q_auto/image.jpg
```

`g_face` auto-detects faces and crops around them — great for team member photos.

---

## 4. Next.js Image Component Tuning

### Fix 1: Add blur placeholders (fix CLS)

Currently no images have `blurDataURL`. This causes **Cumulative Layout Shift** as images pop in. Generate tiny blur placeholders:

**Option A: Inline base64 (build-time)**

For Cloudinary images, request a tiny 10px-wide version as base64:
```
/upload/w_10,q_10,f_webp/image.jpg
```

Store the base64 data URL and pass it:
```tsx
<Image
  src={fullUrl}
  placeholder="blur"
  blurDataURL={tinyBase64Url}
  ...
/>
```

**Option B: Use Cloudinary's blur transformation**
```
/upload/w_50,e_blur:1000,q_1,f_webp/image.jpg
```

This is a ~200-byte blurred placeholder you can inline.

### Fix 2: Correct `sizes` prop everywhere

Some components are missing or have incorrect `sizes`:

| Component | Current `sizes` | Recommended `sizes` |
|-----------|----------------|---------------------|
| HeroSection | `100vw` (implicit) | `100vw` (OK) |
| EventCard | `(max-width: 768px) 100vw, 50vw` | `(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw` |
| TeamCard | `(max-width: 640px) 100vw, ...25vw` | OK |
| JourneyCarousel | `(max-width: 1024px) 100vw, 1200px` | OK |
| Gallery images | Missing | `(max-width: 768px) 100vw, 50vw` |
| DonationModal QR | Missing | `320px` |

### Fix 3: Set `priority` only on above-the-fold images

Currently `priority={true}` is set on:
- Hero image (correct)
- First carousel slide (correct)

Make sure **no other images** have `priority` — it disables lazy loading and forces preload. Verify EventCard, TeamCard, gallery images do NOT have it.

### Fix 4: Configure `formats` in next.config.ts

```ts
images: {
  formats: ["image/avif", "image/webp"],
  ...
}
```

This tells Next.js Image Optimization API to serve AVIF when the browser supports it (via `Accept` header negotiation). This applies to images processed by `/_next/image` — relevant if any images go through Next.js optimization rather than Cloudinary directly.

---

## 5. Bundle & JavaScript Optimization

### Fix 1: Lazy-load Framer Motion

`framer-motion` is ~40KB gzipped. Currently imported directly in `HeroSection`, `AboutSection`, `JourneyCarousel`, `FAQSection`, `DonationModal`, `ScrollReveal`, and `Counter`.

For below-the-fold sections, use dynamic imports:

```tsx
import dynamic from "next/dynamic";

const FAQSection = dynamic(() => import("@/components/sections/FAQSection"), {
  loading: () => <FAQSkeleton />,
});
```

This defers loading Framer Motion code until the component is needed.

### Fix 2: Remove unused dependencies

From `package.json`:
- `styled-components` — appears unused (all styling is Tailwind). Remove if confirmed.
- `embla-carousel-react` — imported in package.json but JourneyCarousel uses a custom implementation. Verify if it's used elsewhere; remove if not.
- `@emailjs/browser` — listed but not imported anywhere in component code. Remove if you're using the server-side `/api/contact` approach instead.

Run `npx depcheck` to find all unused dependencies.

### Fix 3: Optimize Framer Motion imports

Instead of:
```ts
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
```

Use subpath imports (tree-shakeable):
```ts
import { motion } from "framer-motion/m";
```

Or configure `optimizePackageImports` in `next.config.ts`:
```ts
experimental: {
  optimizePackageImports: ["framer-motion", "react-icons"],
},
```

`react-icons` is another common offender — importing `FaFacebook` pulls in the entire FA set without this config.

### Fix 4: Reduce client-side JavaScript in JourneyCarousel

Currently all carousel slides are rendered in the DOM with `opacity: 0/1` toggling. For 4+ slides, this means unnecessary DOM nodes and image decoding.

Render only the **current slide + adjacent slides** (prev/next for swipe animation):

```tsx
{items.filter((_, i) => Math.abs(i - current) <= 1).map(...)}
```

### Fix 5: Remove development scripts in production

**File:** `app/layout.tsx`

The react-grab scripts are loaded in the root layout:
```tsx
<Script src="//unpkg.com/react-grab/dist/index.global.js" strategy="beforeInteractive" />
<Script src="//unpkg.com/@react-grab/mcp/dist/client.global.js" strategy="lazyOnload" />
```

These should be conditionally loaded only in development:
```tsx
{process.env.NODE_ENV === "development" && (
  <>
    <Script ... />
    <Script ... />
  </>
)}
```

The `beforeInteractive` strategy is especially costly — it blocks hydration.

---

## 6. HTTP Headers & CDN

### Fix 1: Add security and performance headers

**File:** `next.config.ts`

```ts
async headers() {
  return [
    {
      source: "/:path*",
      headers: [
        // Cache immutable static assets for 1 year
        // (Next.js already does this for /_next/static, but be explicit)
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      ],
    },
    {
      source: "/_next/static/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },
    {
      source: "/(.*)\\.(jpg|jpeg|png|gif|webp|avif|svg|ico)",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
        },
      ],
    },
  ];
},
```

### Fix 2: Preload critical assets

In `app/(site)/layout.tsx` or `app/layout.tsx`, add preload hints for the hero image and font:

```tsx
<link rel="preload" as="image" href={heroImageUrl} type="image/avif" />
```

Since the hero image URL is dynamic (from Sanity), you'd compute it server-side and inject the preload link.

### Fix 3: DNS prefetch for external origins

```html
<link rel="dns-prefetch" href="//res.cloudinary.com" />
<link rel="dns-prefetch" href="//cdn.sanity.io" />
<link rel="preconnect" href="https://res.cloudinary.com" crossorigin />
<link rel="preconnect" href="https://cdn.sanity.io" crossorigin />
```

This saves ~100-300ms on the first image request by resolving DNS and establishing TCP+TLS connections early.

---

## 7. Core Web Vitals Fixes

### LCP (Largest Contentful Paint)

**Target: < 2.5s**

Current bottleneck: Hero image is the LCP element.

Actions:
1. Add `priority` to hero `<Image>` (already done)
2. Preload hero image with `<link rel="preload">` (see Section 6)
3. Use AVIF format with `f_auto` (see Section 3)
4. Serve appropriately sized image — 1920px for desktop, 1080px for tablet, 640px for mobile using `sizes="100vw"` + responsive Cloudinary URLs
5. Add `fetchpriority="high"` to hero image (Next.js does this when `priority={true}`)

### CLS (Cumulative Layout Shift)

**Target: < 0.1**

Current issues:
- Images without blur placeholders cause layout shift
- Navbar height changes on scroll (fixed → transparent transition)
- Font swap (Montserrat `display: swap`)

Actions:
1. Add `blurDataURL` + `placeholder="blur"` to all images (see Section 4)
2. Reserve space for navbar with fixed height container
3. Use `font-display: optional` instead of `swap` if FOUT is noticeable (trade-off: may show system font briefly)
4. Set explicit `width` and `height` or aspect-ratio containers on all images

### INP (Interaction to Next Paint)

**Target: < 200ms**

Current issues:
- Navbar scroll handler runs on every scroll event (uses rAF but still heavy)
- Carousel touch handlers on mobile
- DonationModal open/close triggers re-render of context consumers

Actions:
1. Debounce navbar scroll handler more aggressively (currently 90ms is good, but the `requestAnimationFrame` + multiple `useEffect` hooks stack)
2. Use `startTransition()` for non-urgent state updates (modal open/close)
3. Memoize carousel event handlers with `useCallback` (already partially done)

---

## 8. Quick Win Checklist

Priority-ordered list of changes with estimated impact:

### High Impact, Low Effort

- [ ] **Wrap all Sanity queries with `React.cache()`** — eliminates duplicate queries per request. File: `sanity/lib/queries.ts`
- [ ] **Change `.format("webp")` to `.format("auto")`** everywhere — serves AVIF to supported browsers. Files: all components calling `urlFor()`
- [ ] **Change `.quality(80)` to `.quality("auto")`** — let Cloudinary pick optimal quality. Same files as above
- [ ] **Enable `useCdn: true`** on serverClient — edge-cached Sanity responses. File: `sanity/lib/client.ts`
- [ ] **Gate dev scripts behind `NODE_ENV`** — remove ~50KB from production. File: `app/layout.tsx`
- [ ] **Add `formats: ["image/avif", "image/webp"]`** to next.config.ts image config

### High Impact, Medium Effort

- [ ] **Merge homepage Sanity queries into one GROQ call** — 6 requests → 1. File: `sanity/lib/queries.ts` + `app/(site)/page.tsx`
- [ ] **Wrap queries with `unstable_cache` + tags** — cross-request caching. File: `sanity/lib/queries.ts`
- [ ] **Update `/api/revalidate` to use `revalidateTag()`** — precise cache invalidation. File: `app/api/revalidate/route.ts`
- [ ] **Add blur placeholders to all images** — fix CLS. Files: all components with `<Image>`
- [ ] **Add `preconnect` for Cloudinary and Sanity CDN** — faster first image load. File: `app/layout.tsx`

### Medium Impact, Low Effort

- [ ] **Add `optimizePackageImports`** for framer-motion and react-icons in next.config. File: `next.config.ts`
- [ ] **Remove unused deps** (styled-components, embla-carousel-react, @emailjs/browser if unused)
- [ ] **Add HTTP cache headers** for static assets and images. File: `next.config.ts`
- [ ] **Add `dns-prefetch`** hints for external domains. File: `app/layout.tsx`

### Medium Impact, Higher Effort

- [ ] **Dynamic import below-fold sections** (FAQ, Impact, MissionSection). File: `app/(site)/page.tsx`
- [ ] **Virtualize carousel** — render only current + adjacent slides. File: `components/sections/JourneyCarousel.tsx`
- [ ] **Generate blur data URLs** at build time or via Cloudinary transformation. File: `sanity/lib/image.ts`
- [ ] **Add error.tsx** boundary files for graceful error handling. Files: `app/(site)/error.tsx`, `app/(site)/events/error.tsx`

---

## Summary of Expected Gains

| Optimization | Metric Improved | Estimated Improvement |
|---|---|---|
| Merge Sanity queries + `React.cache()` | TTFB, Server time | ~300-500ms faster server render |
| Enable Sanity CDN | TTFB | ~150-350ms per query |
| AVIF via `f_auto` | LCP, Total bytes | 20-30% smaller images |
| `q_auto` quality | Total bytes | 10-20% smaller images |
| Blur placeholders | CLS | CLS score → near 0 |
| Dev script gating | FCP, TTI | ~50KB less JS in production |
| `optimizePackageImports` | Bundle size | ~15-25KB less JS |
| HTTP cache headers | Repeat visits | Instant static asset loads |
| Preconnect hints | LCP | ~100-300ms faster first image |

**Combined estimated impact:** 40-60% reduction in total page weight, 500ms+ faster initial load, near-zero CLS.
