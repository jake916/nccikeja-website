import { CalendarIcon } from "@sanity/icons/Calendar";
import { defineArrayMember, defineField, defineType } from "sanity";

import { imageField } from "../shared/image-field";

export const EVENT_CATEGORIES = [
  { title: "Sunday Service", value: "sundayService" },
  { title: "Special Service", value: "specialService" },
  { title: "Conference", value: "conference" },
  { title: "Community", value: "community" },
];

export const event = defineType({
  name: "event",
  title: "Event",
  type: "document",
  icon: CalendarIcon,
  groups: [
    { name: "details", title: "Details", default: true },
    { name: "content", title: "Page Content" },
    { name: "registration", title: "Registration" },
  ],
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required(), group: "details" }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
      group: "details",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: { list: EVENT_CATEGORIES, layout: "radio" },
      initialValue: "specialService",
      group: "details",
    }),
    defineField({ name: "label", title: "Badge", type: "string", description: 'Optional highlight, e.g. "Premium" or "Special Event"', group: "details" }),
    defineField({ name: "startDate", title: "Start Date", type: "date", validation: (rule) => rule.required(), group: "details" }),
    defineField({
      name: "endDate",
      title: "End Date",
      type: "date",
      description: "Leave empty for one-day events",
      group: "details",
      validation: (rule) =>
        rule.custom((endDate, context) => {
          const startDate = (context.document as { startDate?: string } | undefined)?.startDate;
          return !endDate || !startDate || endDate >= startDate || "End date must be on or after the start date";
        }),
    }),
    defineField({ name: "startTime", title: "Start Time", type: "string", description: 'e.g. "6:00 PM" (used for calendar invites)', group: "details" }),
    defineField({ name: "timeLabel", title: "Time (as displayed)", type: "string", description: 'e.g. "9:00 AM & 11:30 AM"', group: "details" }),
    defineField({ name: "venue", title: "Venue", type: "string", description: 'e.g. "Main Sanctuary"', group: "details" }),
    defineField({ name: "address", title: "Address", type: "string", group: "details" }),
    defineField({ name: "speaker", title: "Speaker / Host", type: "string", group: "details" }),
    defineField({ name: "featured", title: "Feature on the Events page", type: "boolean", initialValue: false, group: "details" }),
    defineField({ name: "summary", title: "Summary", type: "text", rows: 3, group: "content" }),
    defineField({ name: "body", title: "About the Event", type: "array", of: [defineArrayMember({ type: "block" })], group: "content" }),
    { ...imageField("image", "Image"), group: "content" },
    { ...imageField("galleryImage", "Gallery Image", "Shown under the event description"), group: "content" },
    defineField({ name: "streamUrl", title: "Stream Link", type: "url", group: "content" }),
    defineField({ name: "registrationOpen", title: "Accept registrations", type: "boolean", initialValue: false, group: "registration" }),
    defineField({ name: "registrationNote", title: "Registration Note", type: "text", rows: 3, group: "registration" }),
  ],
  orderings: [{ title: "Start date", name: "startDateAsc", by: [{ field: "startDate", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "startDate", media: "image" } },
});
