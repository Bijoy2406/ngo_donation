import { defineType, defineField } from "sanity";

export const teamMember = defineType({
  name: "teamMember",
  title: "Team Members",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Full Name", type: "string" }),
    defineField({ name: "role", title: "Role / Position", type: "string" }),
    defineField({
      name: "image",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "isAdvisor",
      title: "Advisor",
      type: "boolean",
      description: "Turn on to list this person as an Advisor instead of a Team Member.",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      initialValue: 99,
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "image", isAdvisor: "isAdvisor" },
    prepare({ title, subtitle, media, isAdvisor }) {
      return {
        title,
        subtitle: `${isAdvisor ? "Advisor" : "Team"} · ${subtitle ?? ""}`,
        media,
      };
    },
  },
});
