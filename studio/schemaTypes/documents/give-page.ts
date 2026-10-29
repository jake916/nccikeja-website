import { HeartIcon } from "@sanity/icons/Heart";
import { defineArrayMember, defineField, defineType } from "sanity";

import { imageField } from "../shared/image-field";

export const givePage = defineType({
  name: "givePage",
  title: "Give Page",
  type: "document",
  icon: HeartIcon,
  fields: [
    imageField("heroImage", "Hero Image"),
    defineField({ name: "verse", title: "Scripture Verse", type: "text", rows: 3 }),
    defineField({ name: "verseReference", title: "Verse Reference", type: "string", description: 'e.g. "2 Corinthians 9:7"' }),
    defineField({ name: "featuredBank", title: "Featured Bank", type: "featuredBank" }),
    defineField({
      name: "otherAccounts",
      title: "Other Naira Accounts",
      type: "array",
      of: [defineArrayMember({ type: "bankAccount" })],
    }),
    defineField({
      name: "domiciliaryAccounts",
      title: "Domiciliary Accounts",
      type: "array",
      of: [defineArrayMember({ type: "domiciliaryAccount" })],
    }),
    imageField("impactImage", "Impact Section Image"),
  ],
  preview: { prepare: () => ({ title: "Give Page" }) },
});
