import { defineType, defineField } from "sanity";
import { descriptionBlock } from "./descriptionContent";

export const missionSection = defineType({
  name: "missionSection",
  title: "Mission Section",
  type: "document",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string" }),

    defineField({
      name: "description",
      title: "Mission Description",
      type: "array",
      of: [descriptionBlock],
    }),

    defineField({
      name: "image",
      title: "Mission Image (Square)",
      type: "image",
      options: { hotspot: true },
    }),
  ],

  preview: {
    prepare: () => ({ title: "Mission Section" }),
  },
});
