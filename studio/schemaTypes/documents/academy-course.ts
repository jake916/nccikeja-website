import { BookIcon } from "@sanity/icons/Book";
import { defineField, defineType } from "sanity";

export const academyCourse = defineType({
  name: "academyCourse",
  title: "Academy Course",
  type: "document",
  icon: BookIcon,
  fields: [
    defineField({
      name: "level",
      title: "Level",
      type: "number",
      description: "100, 200, 300…",
      validation: (rule) => rule.required().integer().positive(),
    }),
    defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "summary",
      title: "Short Summary",
      type: "string",
      description: 'One line for the Who We Are page, e.g. "Biblical Foundation & Membership Course. Start here and join the family."',
    }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      options: {
        list: [
          { title: "Foundation", value: "foundation" },
          { title: "Couple", value: "couple" },
          { title: "Globe", value: "globe" },
          { title: "Growth chart", value: "growth" },
          { title: "Award", value: "award" },
        ],
      },
    }),
  ],
  orderings: [{ title: "Level", name: "levelAsc", by: [{ field: "level", direction: "asc" }] }],
  preview: {
    select: { level: "level", title: "title" },
    prepare: ({ level, title }) => ({ title, subtitle: level ? `${level} Level` : undefined }),
  },
});
