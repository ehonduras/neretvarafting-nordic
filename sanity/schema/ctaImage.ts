import { defineType, defineField } from "sanity";

export const ctaImage = defineType({
  name: "ctaImage",
  title: "CTA Image",
  type: "document",
  fields: [
    defineField({
      name: "image",
      title: "CTA Photo",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "alt",
      title: "Alt Text",
      type: "string",
      initialValue: "Neretva river rafting adventure",
    }),
  ],
});
