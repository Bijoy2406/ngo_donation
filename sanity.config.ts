import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemaTypes";

const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ||
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  "xnrhf9do";
const dataset =
  process.env.SANITY_STUDIO_DATASET ||
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  "production";

if (!projectId || !dataset) {
  throw new Error(
    "Missing Sanity environment variables. Set SANITY_STUDIO_PROJECT_ID and SANITY_STUDIO_DATASET (or NEXT_PUBLIC_SANITY_PROJECT_ID/NEXT_PUBLIC_SANITY_DATASET)."
  );
}

const plugins = [
  structureTool({
    structure: (S) =>
      S.list()
        .title("Content")
        .items([
          S.listItem()
            .title("Site Settings")
            .id("siteSettings")
            .child(
              S.document().schemaType("siteSettings").documentId("siteSettings")
            ),
          S.divider(),
          S.documentTypeListItem("event").title("Events"),
          S.documentTypeListItem("teamMember").title("Team Members"),
          S.documentTypeListItem("carouselItem").title("Journey Carousel"),
          S.divider(),
          S.listItem()
            .title("Mission Section")
            .id("missionSection")
            .child(
              S.document().schemaType("missionSection").documentId("missionSection")
            ),
          S.documentTypeListItem("impactItem").title("Impact Cards"),
          S.documentTypeListItem("faqItem").title("FAQ"),
          S.divider(),
          S.listItem()
            .title("Donation Settings")
            .id("donationSettings")
            .child(
              S.document().schemaType("donationSettings").documentId("donationSettings")
            ),
        ]),
  }),
  visionTool(),
];

export default defineConfig({
  name: "faf-studio",
  title: "Farhana Afroz Foundation",
  projectId,
  dataset,
  plugins,
  schema: {
    types: schemaTypes,
  },
});
