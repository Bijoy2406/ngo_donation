import { defineType, defineField } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({ name: "heroHeading", title: "Hero Heading", type: "string" }),
    defineField({
      name: "heroSubheading",
      title: "Hero Subheading",
      type: "string",
    }),
    defineField({
      name: "heroImage",
      title: "Hero Background Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "aboutHeading",
      title: "About Section Heading",
      type: "string",
    }),
    defineField({
      name: "aboutDescription",
      title: "About Description",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "totalEvents",
      title: "Total Events",
      type: "number",
    }),
    defineField({
      name: "peopleEngaged",
      title: "People Engaged",
      type: "number",
    }),
    defineField({
      name: "yearsActive",
      title: "Years Active",
      type: "number",
    }),
    defineField({
      name: "email",
      title: "Contact Email",
      type: "string",
    }),
    defineField({
      name: "phone",
      title: "Contact Phone",
      type: "string",
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "whatsappNumber",
      title: "WhatsApp Number (with country code, e.g. +8801XXXXXXXXX)",
      type: "string",
    }),
    defineField({
      name: "instagramUrl",
      title: "Instagram URL",
      type: "url",
    }),
    defineField({
      name: "facebookUrl",
      title: "Facebook URL",
      type: "url",
    }),
    defineField({
      name: "twitterUrl",
      title: "Twitter/X URL",
      type: "url",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site Settings" }),
  },
});
