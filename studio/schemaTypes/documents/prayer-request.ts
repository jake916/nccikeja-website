import { HeartIcon } from "@sanity/icons/Heart";
import { defineField, defineType } from "sanity";

/** Submitted from the website's prayer request form. */
export const prayerRequest = defineType({
  name: "prayerRequest",
  title: "Prayer Request",
  type: "document",
  icon: HeartIcon,
  readOnly: true,
  fields: [
    defineField({ name: "anonymous", title: "Anonymous", type: "boolean" }),
    defineField({ name: "name", title: "Name", type: "string" }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({ name: "category", title: "Category", type: "string" }),
    defineField({ name: "request", title: "Request", type: "text" }),
    defineField({ name: "followUp", title: "Wants a follow-up", type: "boolean" }),
    defineField({ name: "submittedAt", title: "Submitted", type: "datetime" }),
  ],
  orderings: [{ title: "Newest first", name: "submittedDesc", by: [{ field: "submittedAt", direction: "desc" }] }],
  preview: {
    select: { name: "name", anonymous: "anonymous", category: "category", followUp: "followUp" },
    prepare: ({ name, anonymous, category, followUp }) => ({
      title: anonymous || !name ? "Anonymous" : name,
      subtitle: [category, followUp && "Follow up"].filter(Boolean).join(" · "),
    }),
  },
});
