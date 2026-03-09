import { defineType, defineField } from "sanity";

export const impactItem = defineType({
  name: "impactItem",
  title: "Impact Cards",
  type: "document",
  fields: [
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      description: "Icon name: heart, users, globe, education, lightbulb, star, hands, leaf",
      options: {
        list: [
          { title: "Heart", value: "heart" },
          { title: "Users / Community", value: "users" },
          { title: "Globe / World", value: "globe" },
          { title: "Education", value: "education" },
          { title: "Light Bulb / Ideas", value: "lightbulb" },
          { title: "Star", value: "star" },
          { title: "Hands / Care", value: "hands" },
          { title: "Leaf / Environment", value: "leaf" },
        ],
      },
    }),
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({
      name: "description",
      title: "Short Description",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      initialValue: 99,
    }),
  ],
  preview: {
    select: { title: "heading" },
  },
});
