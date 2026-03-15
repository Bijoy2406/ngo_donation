import { defineType, defineField } from "sanity";

export const donationSettings = defineType({
  name: "donationSettings",
  title: "Donation Settings",
  type: "document",
  fields: [
    defineField({
      name: "heading",
      title: "Modal Heading",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Donation Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "rules",
      title: "Donation Rules / Notes",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "bankName",
      title: "Bank Name",
      type: "string",
    }),
    defineField({
      name: "branchName",
      title: "Branch Name",
      type: "string",
    }),
    defineField({
      name: "accountName",
      title: "Account Name",
      type: "string",
    }),
    defineField({
      name: "accountNumber",
      title: "Account Number",
      type: "string",
    }),
    defineField({
      name: "swiftCode",
      title: "SWIFT Code",
      type: "string",
    }),
    defineField({
      name: "routingNumber",
      title: "Routing Number",
      type: "string",
    }),
    defineField({
      name: "qrCode",
      title: "QR Code Image",
      type: "image",
      options: { hotspot: false },
    }),
  ],
  preview: {
    prepare: () => ({ title: "Donation Settings" }),
  },
});
