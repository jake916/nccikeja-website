import { CalendarIcon } from "@sanity/icons/Calendar";
import { defineArrayMember, defineField, defineType } from "sanity";

export const serviceDay = defineType({
  name: "serviceDay",
  title: "Service Day",
  type: "object",
  icon: CalendarIcon,
  fields: [
    defineField({ name: "day", title: "Day", type: "string", description: 'e.g. "Sundays"' }),
    defineField({
      name: "services",
      title: "Services",
      type: "array",
      of: [
        defineArrayMember({
          name: "service",
          type: "object",
          fields: [
            defineField({ name: "name", title: "Name", type: "string" }),
            defineField({ name: "time", title: "Time", type: "string", description: 'e.g. "9:00AM"' }),
          ],
          preview: { select: { title: "name", subtitle: "time" } },
        }),
      ],
    }),
  ],
  preview: { select: { title: "day" } },
});
