import { HomeIcon } from "@sanity/icons/Home";
import { defineArrayMember, defineField, defineType } from "sanity";

import { imageField } from "../shared/image-field";

export const homePage = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  icon: HomeIcon,
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "welcome", title: "Welcome" },
    { name: "media", title: "Sermon & Testimony" },
  ],
  fields: [
    defineField({ name: "heroHeading", title: "Hero Heading", type: "string", group: "hero" }),
    defineField({ name: "heroSubheading", title: "Hero Subheading", type: "string", group: "hero" }),
    defineField({
      name: "heroImages",
      title: "Hero Slideshow",
      description: "Shown full-width behind the hero text, changing every 3 seconds",
      type: "array",
      group: "hero",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [defineField({ name: "alt", title: "Alternative Text", type: "string" })],
        }),
      ],
      validation: (rule) => rule.min(1).max(6),
    }),

    defineField({ name: "welcomeHeading", title: "Welcome Heading", type: "string", group: "welcome" }),
    defineField({ name: "welcomeText", title: "Welcome Text", type: "text", rows: 4, group: "welcome" }),
    defineField({ name: "vision", title: "Vision Statement", type: "text", rows: 2, group: "welcome" }),
    defineField({ name: "mission", title: "Mission Statement", type: "text", rows: 2, group: "welcome" }),
    { ...imageField("welcomeImage", "Welcome Image"), group: "welcome" },
    defineField({ name: "welcomeImageCaption", title: "Welcome Image Caption", type: "string", group: "welcome" }),
    defineField({ name: "welcomeImageSubcaption", title: "Welcome Image Subcaption", type: "string", group: "welcome" }),
    { ...imageField("inPersonImage", "In Person Card Image", 'Shown in the "Ways to Connect" section'), group: "welcome" },

    { ...imageField("sermonImage", "Featured Sermon Image"), group: "media" },
    defineField({ name: "sermonVideoUrl", title: "Featured Sermon Video URL", type: "url", group: "media" }),
    { ...imageField("testimonyImage", "Featured Testimony Image"), group: "media" },
    defineField({ name: "testimonyVideoUrl", title: "Featured Testimony Video URL", type: "url", group: "media" }),
  ],
  preview: { prepare: () => ({ title: "Home Page" }) },
});
