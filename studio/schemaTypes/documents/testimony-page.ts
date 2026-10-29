import { StarIcon } from "@sanity/icons/Star";
import { defineField, defineType } from "sanity";

import { imageField } from "../shared/image-field";

export const testimonyPage = defineType({
  name: "testimonyPage",
  title: "Testimony Page",
  type: "document",
  icon: StarIcon,
  fields: [
    defineField({ name: "heroHeading", title: "Hero Heading", type: "string" }),
    defineField({ name: "heroText", title: "Hero Text", type: "text", rows: 2 }),
    imageField("heroImage", "Hero Image"),
    defineField({ name: "watchUrl", title: "Watch Testimonies Link", type: "url", description: "e.g. a YouTube playlist of testimonies" }),
    defineField({ name: "formHeading", title: "Form Heading", type: "string" }),
    defineField({ name: "formText", title: "Form Text", type: "text", rows: 2 }),
    defineField({ name: "expressions", title: "Expressions (Campuses)", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "categories", title: "Testimony Categories", type: "array", of: [{ type: "string" }] }),
  ],
  preview: { prepare: () => ({ title: "Testimony Page" }) },
});
