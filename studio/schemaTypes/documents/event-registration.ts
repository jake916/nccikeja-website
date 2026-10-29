import { CheckmarkCircleIcon } from "@sanity/icons/CheckmarkCircle";
import { defineField, defineType } from "sanity";

/** Submitted from an event's registration form. */
export const eventRegistration = defineType({
  name: "eventRegistration",
  title: "Event Registration",
  type: "document",
  icon: CheckmarkCircleIcon,
  readOnly: true,
  fields: [
    defineField({ name: "event", title: "Event", type: "reference", to: [{ type: "event" }] }),
    defineField({ name: "fullName", title: "Full Name", type: "string" }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({ name: "phone", title: "Phone", type: "string" }),
    defineField({ name: "heardFrom", title: "Heard about us from", type: "string" }),
    defineField({ name: "submittedAt", title: "Submitted", type: "datetime" }),
  ],
  orderings: [{ title: "Newest first", name: "submittedDesc", by: [{ field: "submittedAt", direction: "desc" }] }],
  preview: { select: { title: "fullName", subtitle: "event.title" } },
});
