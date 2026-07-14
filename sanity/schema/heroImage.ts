import { defineType, defineField } from "sanity";

export const heroImage = defineType({
  name: "heroImage",
  title: "Hero Image",
  type: "document",
  fields: [
    defineField({
      name: "image",
      title: "Hero Photo",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "alt",
      title: "Alt Text",
      type: "string",
      initialValue: "Neretva river canyon rafting",
    }),
  ],
});
