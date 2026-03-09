import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schemaTypes";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;

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
];

if (typeof window !== "undefined") {
  // Vision relies on browser/client React APIs.
  const { visionTool } = require("@sanity/vision");
  plugins.push(visionTool());
}

export default defineConfig({
  basePath: "/studio",
  name: "faf-studio",
  title: "Farzana Afroz Foundation",
  projectId,
  dataset,
  plugins,
  schema: {
    types: schemaTypes,
  },
});
