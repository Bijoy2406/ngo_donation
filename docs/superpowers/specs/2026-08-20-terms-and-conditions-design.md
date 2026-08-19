# Terms & Conditions Section — Design

**Date:** 2026-08-20
**Status:** Approved

## Context

The footer's "Legal & Policy" link (`components/layout/Footer.tsx`) already points to `/legal-policy`, which currently renders a "coming soon" stub (`app/(site)/legal-policy/page.tsx`). The user supplied a standalone reference file, `terms-and-conditions.html`, containing full Terms & Conditions copy for Farhana Afroz Foundation, styled with its own green/gold palette that does not match the live site's Tailwind theme.

## Goal

Replace the `/legal-policy` stub with a fully themed Terms & Conditions page that:
- Matches the site's real Tailwind design system (the `sage` palette, `shadow-card`, `ScrollReveal`, existing hero/section conventions from pages like `mission` and `about`).
- Preserves the reference file's content structure: sticky table-of-contents sidebar with scroll-spy, 16 numbered sections, intro callout, and a highlighted note callout.
- Reuses live site data (Sanity `siteSettings`) for contact details instead of hardcoding them, consistent with `Footer.tsx`.

## Non-goals

- No changes to `Footer.tsx` (already links correctly).
- No changes to the unrelated pending diffs in `app/(site)/layout.tsx` / `components/ui/DonationModal.tsx` already present in the working tree.
- No new routes — content replaces the existing `/legal-policy` page rather than adding `/terms-and-conditions`.
- No copy changes beyond cosmetic re-theming and live contact data substitution.

## Architecture

### Files

- **`components/legal/TermsAndConditions.tsx`** (new, client component)
  Holds the scroll-spy state for the sticky TOC using `react-intersection-observer` (already a project dependency, used by `ScrollReveal`). Accepts optional `email` / `phone` props sourced from Sanity site settings, falling back to the reference file's static values (`farhanaafrozfoundation@gmail.com`, `+8801712422246`) when settings are empty. Renders the full hero + TOC + content layout.

- **`app/(site)/legal-policy/page.tsx`** (modified)
  Server component. Fetches `getSiteSettings()` (same query Footer/layout already use), updates `metadata.title` to `"Terms & Conditions | Farhana Afroz Foundation"`, and renders `<TermsAndConditions email={settings?.email} phone={settings?.phone} />`.

### Layout

1. **Hero band** — light `bg-sage-50` section (matching `mission`/`about` hero pattern), containing:
   - Uppercase eyebrow label (`text-sage-500`)
   - `<h1>` "Terms & Conditions" in bold `sage-900`
   - Lede paragraph in `sage-600`
   - Meta row: Effective date / Applies to / Organization based in
   - Wrapped in `ScrollReveal`

2. **Two-column layout** (`lg:grid-cols-12` or similar, matching `mission` page's grid conventions):
   - **Sticky TOC sidebar** (left, ~3-4 cols, desktop only via `lg:` breakpoint, `sticky top-*`): white card, `border-sage-100`, `rounded-[14px]`, `shadow-card`, uppercase "On this page" label, 16 numbered links. Active section highlighted via `IntersectionObserver` (left border + `sage-900` text + font-weight), mirroring the reference file's scroll-spy behavior. On mobile, this collapses to a normal block above the content (no sticky).
   - **Content column** (right, ~8-9 cols):
     - Intro callout: `bg-sage-50`, left accent border (`border-sage-400`), rounded, `sage-600` text
     - 16 numbered sections, each with a circular numbered marker (`border-sage-300`, `sage-700` number) connected by a vertical connector line between markers, heading in `sage-900`, body copy in `text-gray-600` (matching `mission` page body text), bulleted lists where the reference file has them
     - One highlighted "note" callout (tax-treatment note in the Donations section) styled as a soft `bg-sage-100` box

3. **Section 16 (Contact Us)** and the hero meta row render `email`/`phone` props (from Sanity, falling back to static defaults) instead of hardcoded text.

### Content

All 16 sections carried over verbatim from `terms-and-conditions.html`:
1. Acceptance of Terms
2. About the Foundation
3. Eligibility & Use of the Site
4. Donations
5. Volunteering
6. Events & Programs
7. Intellectual Property
8. User Submissions
9. Third-Party Links & Services
10. Privacy
11. Disclaimers
12. Limitation of Liability
13. Indemnification
14. Governing Law & Jurisdiction
15. Changes to These Terms
16. Contact Us

No copy edits beyond substituting live contact data where applicable.

### Scroll-spy behavior

Reimplemented in React using `react-intersection-observer`'s `useInView` per-section (or a single `IntersectionObserver` in a `useEffect`, mirroring the reference file's vanilla-JS approach but adapted to React lifecycle) to toggle an "active" TOC link as the user scrolls, with the same `rootMargin` tuning (`-15% 0px -70% 0px`) as the reference.

### Responsive behavior

- Desktop (`lg:` and up): sticky sidebar + content, 2-column grid.
- Mobile/tablet: single column, TOC renders as a normal (non-sticky) block above the content, links still functional as anchor jumps.

## Testing

- Manual verification: page loads at `/legal-policy`, TOC links scroll to correct sections, active TOC state updates on scroll, responsive layout collapses correctly below `lg:`, contact info reflects Sanity settings when present and falls back correctly when absent.
- No new automated test infra implied by existing project conventions (no test files found for other content pages like `mission`/`about`).
