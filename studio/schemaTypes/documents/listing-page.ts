import { DocumentIcon } from "@sanity/icons/Document";
import { defineField, defineType } from "sanity";

import { imageField } from "../shared/image-field";

/** Hero copy for the Sermons, Publications and Events listing pages (one document each). */
export const listingPage = defineType({
  name: "listingPage",
  title: "Listing Page",
  type: "document",
  icon: DocumentIcon,
  fields: [
    defineField({ name: "title", title: "Page", type: "string", readOnly: true }),
    defineField({ name: "heroHeading", title: "Hero Heading", type: "string" }),
    defineField({ name: "heroText", title: "Hero Text", type: "text", rows: 2 }),
    imageField("heroImage", "Hero Image"),
    defineField({ name: "ctaHeading", title: "Closing Banner Heading", type: "string" }),
    defineField({ name: "ctaText", title: "Closing Banner Text", type: "text", rows: 2 }),
  ],
  preview: { select: { title: "title" } },
});
