import { CogIcon } from "@sanity/icons/Cog";
import { defineArrayMember, defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  icon: CogIcon,
  fields: [
    defineField({ name: "tagline", title: "Tagline", type: "string" }),
    defineField({ name: "address", title: "Address", type: "string" }),
    defineField({ name: "email", title: "Email", type: "string", validation: (rule) => rule.email() }),
    defineField({ name: "phone", title: "Phone", type: "string" }),
    defineField({
      name: "serviceTimes",
      title: "Service Times",
      type: "array",
      of: [defineArrayMember({ type: "serviceDay" })],
    }),
    defineField({ name: "socialLinks", title: "Social Links", type: "socialLinks" }),
  ],
  preview: { prepare: () => ({ title: "Site Settings" }) },
});
