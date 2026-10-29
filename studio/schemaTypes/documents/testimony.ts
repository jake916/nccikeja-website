import { StarIcon } from "@sanity/icons/Star";
import { defineField, defineType } from "sanity";

/** Submitted from the website's "Share Your Testimony" form. */
export const testimony = defineType({
  name: "testimony",
  title: "Testimony",
  type: "document",
  icon: StarIcon,
  readOnly: true,
  fields: [
    defineField({ name: "fullName", title: "Full Name", type: "string" }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({ name: "phone", title: "Phone", type: "string" }),
    defineField({ name: "expression", title: "Expression (Campus)", type: "string" }),
    defineField({ name: "category", title: "Category", type: "string" }),
    defineField({ name: "story", title: "Testimony", type: "text" }),
    defineField({ name: "submittedAt", title: "Submitted", type: "datetime" }),
  ],
  orderings: [{ title: "Newest first", name: "submittedDesc", by: [{ field: "submittedAt", direction: "desc" }] }],
  preview: { select: { title: "fullName", subtitle: "category" } },
});
