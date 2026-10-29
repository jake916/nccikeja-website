import { UsersIcon } from "@sanity/icons/Users";
import { defineArrayMember, defineField, defineType } from "sanity";

import { pillarIcons, programmeIcons, valueIcons } from "../shared/icon-options";
import { imageField } from "../shared/image-field";

export const whoWeArePage = defineType({
  name: "whoWeArePage",
  title: "Who We Are Page",
  type: "document",
  icon: UsersIcon,
  groups: [
    { name: "intro", title: "Hero & Vision", default: true },
    { name: "values", title: "Values & Method" },
    { name: "programmes", title: "Academy & Programmes" },
  ],
  fields: [
    defineField({ name: "heroHeading", title: "Hero Heading", type: "string", group: "intro" }),
    defineField({ name: "heroText", title: "Hero Text", type: "text", rows: 2, group: "intro" }),
    { ...imageField("heroImage", "Hero Image"), group: "intro" },
    defineField({ name: "visionHeading", title: "Vision Heading", type: "string", group: "intro" }),
    defineField({ name: "visionText", title: "Vision Text", type: "text", rows: 2, group: "intro" }),
    defineField({ name: "mandateHeading", title: "Mandate Heading", type: "string", group: "intro" }),
    defineField({ name: "mandateText", title: "Mandate Text", type: "text", rows: 4, group: "intro" }),
    defineField({ name: "promiseHeading", title: "Promise Card Heading", type: "string", group: "intro" }),
    defineField({ name: "promiseText", title: "Promise Card Text", type: "string", group: "intro" }),
    defineField({ name: "promiseTag", title: "Promise Card Tag", type: "string", group: "intro" }),

    defineField({
      name: "coreValues",
      title: "Core Values",
      type: "array",
      group: "values",
      of: [
        defineArrayMember({
          name: "coreValue",
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
            defineField({ name: "icon", title: "Icon", type: "string", options: { list: valueIcons } }),
          ],
          preview: { select: { title: "title", subtitle: "description" } },
        }),
      ],
    }),
    defineField({ name: "methodText", title: "Our Method Intro", type: "text", rows: 2, group: "values" }),
    { ...imageField("methodBackground", "Our Method Background"), group: "values" },
    defineField({
      name: "pillars",
      title: "Teaching Pillars",
      type: "array",
      group: "values",
      of: [
        defineArrayMember({
          name: "pillar",
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "icon", title: "Icon", type: "string", options: { list: pillarIcons } }),
          ],
          preview: { select: { title: "title", subtitle: "icon" } },
        }),
      ],
    }),

    defineField({ name: "academyText", title: "Academy Intro", type: "text", rows: 2, group: "programmes" }),
    { ...imageField("academyBackground", "Academy Background"), group: "programmes" },
    defineField({ name: "programmesText", title: "Programmes Intro", type: "text", rows: 2, group: "programmes" }),
    defineField({
      name: "programmes",
      title: "Flagship Programmes",
      type: "array",
      group: "programmes",
      of: [
        defineArrayMember({
          name: "programme",
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
            defineField({ name: "icon", title: "Icon", type: "string", options: { list: programmeIcons } }),
          ],
          preview: { select: { title: "title", subtitle: "description" } },
        }),
      ],
    }),
    defineField({
      name: "featuredProgramme",
      title: "Featured Programme",
      description: 'The wide navy card, e.g. "The Outstanding Weekend"',
      type: "object",
      group: "programmes",
      fields: [
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
        defineField({
          name: "highlights",
          title: "Highlights",
          type: "array",
          of: [
            defineArrayMember({
              name: "highlight",
              type: "object",
              fields: [
                defineField({ name: "title", title: "Title", type: "string" }),
                defineField({ name: "text", title: "Text", type: "string" }),
              ],
            }),
          ],
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Who We Are Page" }) },
});
