import { defineType, defineField } from "sanity";

export const keyAchievementItem = defineType({
  name: "keyAchievementItem",
  title: "Key Achievement",
  type: "document",
  fields: [
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      description:
        "Pick an icon for this achievement card.",
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
          { title: "Woman", value: "woman" },
          { title: "First Aid", value: "firstAid" },
          { title: "Medical Emergency", value: "medicalEmergency" },
          { title: "Stethoscope", value: "stethoscope" },
          { title: "Office Building", value: "officeBuilding" },
          { title: "Helping Hand", value: "hand" },
          { title: "Library", value: "library" },
          { title: "Beaker / Research", value: "beaker" },
          { title: "Light Bulb (Outline)", value: "lightBulb" },
          { title: "Shield Check", value: "shieldCheck" },
          { title: "Graduation", value: "graduation" },
          { title: "Snowflake / Winter", value: "snowflake" },
          { title: "Global", value: "global" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (rule) => rule.required().min(5).max(220),
    }),
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
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: "heading" },
  },
});
