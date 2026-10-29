import { ClipboardIcon } from "@sanity/icons/Clipboard";
import { defineField, defineType } from "sanity";

/** Submitted from the website's Academy enrolment form. */
export const enrolment = defineType({
  name: "enrolment",
  title: "Academy Enrolment",
  type: "document",
  icon: ClipboardIcon,
  readOnly: true,
  fields: [
    defineField({ name: "fullName", title: "Full Name", type: "string" }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({ name: "phone", title: "Phone", type: "string" }),
    defineField({ name: "course", title: "Course", type: "reference", to: [{ type: "academyCourse" }] }),
    defineField({ name: "statement", title: "Personal Statement", type: "text" }),
    defineField({ name: "submittedAt", title: "Submitted", type: "datetime" }),
  ],
  orderings: [{ title: "Newest first", name: "submittedDesc", by: [{ field: "submittedAt", direction: "desc" }] }],
  preview: {
    select: { title: "fullName", course: "course.title", date: "submittedAt" },
    prepare: ({ title, course, date }) => ({
      title,
      subtitle: [course, date && new Date(date).toLocaleDateString()].filter(Boolean).join(" · "),
    }),
  },
});
