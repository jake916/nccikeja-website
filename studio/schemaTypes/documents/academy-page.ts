import { BookIcon } from "@sanity/icons/Book";
import { defineField, defineType } from "sanity";

import { imageField } from "../shared/image-field";

export const academyPage = defineType({
  name: "academyPage",
  title: "Academy Page",
  type: "document",
  icon: BookIcon,
  groups: [
    { name: "overview", title: "Overview", default: true },
    { name: "enrolment", title: "Enrolment Form" },
  ],
  fields: [
    defineField({ name: "heroTag", title: "Hero Tag", type: "string", group: "overview" }),
    defineField({ name: "heroHeading", title: "Hero Heading", type: "string", group: "overview" }),
    defineField({ name: "heroText", title: "Hero Text", type: "string", group: "overview" }),
    { ...imageField("heroImage", "Hero Image"), group: "overview" },
    defineField({ name: "ctaText", title: "Closing Call to Action", type: "text", rows: 2, group: "overview" }),

    defineField({ name: "enrolHeading", title: "Enrolment Hero Heading", type: "string", group: "enrolment" }),
    defineField({ name: "enrolText", title: "Enrolment Hero Text", type: "string", group: "enrolment" }),
    { ...imageField("enrolImage", "Enrolment Hero Image"), group: "enrolment" },
    defineField({ name: "formHeading", title: "Form Heading", type: "string", group: "enrolment" }),
    defineField({ name: "formText", title: "Form Subheading", type: "string", group: "enrolment" }),
    defineField({ name: "successHeading", title: "Success Heading", type: "string", group: "enrolment" }),
    defineField({ name: "successText", title: "Success Message", type: "text", rows: 2, group: "enrolment" }),
    defineField({
      name: "nextSteps",
      title: "Next Steps",
      type: "array",
      of: [{ type: "string" }],
      group: "enrolment",
      validation: (rule) => rule.max(3),
    }),
  ],
  preview: { prepare: () => ({ title: "Academy Page" }) },
});
