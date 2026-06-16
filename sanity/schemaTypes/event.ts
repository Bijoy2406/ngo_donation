import { defineType, defineField } from "sanity";
import { descriptionBlock } from "./descriptionContent";

export const event = defineType({
  name: "event",
  title: "Events",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
    }),
    defineField({
      name: "shortDescription",
      title: "Short Description",
      type: "array",
      of: [descriptionBlock],
    }),
    defineField({
      name: "description",
      title: "Full Description",
      type: "array",
      of: [descriptionBlock],
    }),
    defineField({
      name: "thumbnail",
      title: "Thumbnail Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "gallery",
      title: "Gallery Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      options: { layout: "grid" },
    }),
    defineField({ name: "date", title: "Event Date", type: "date" }),
    defineField({
      name: "featured",
      title: "Show on Homepage",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "featuredOrder",
      title: "Homepage Order (1 = first)",
      type: "number",
    }),
    defineField({
      name: "isOngoing",
      title: "Ongoing Event",
      type: "boolean",
      description: "Turn on to mark this as an ongoing/active event.",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "title", media: "thumbnail", isOngoing: "isOngoing" },
    prepare({ title, media, isOngoing }) {
      return {
        title,
        subtitle: isOngoing ? "Ongoing" : "Past",
        media,
      };
    },
  },
});
