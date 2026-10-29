import { PlayIcon } from "@sanity/icons/Play";
import { defineField, defineType } from "sanity";

import { imageField } from "../shared/image-field";

export const sermon = defineType({
  name: "sermon",
  title: "Sermon",
  type: "document",
  icon: PlayIcon,
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "series", title: "Series", type: "string", description: 'e.g. "Faith Foundations"' }),
    defineField({ name: "speaker", title: "Speaker", type: "string" }),
    defineField({ name: "date", title: "Date Preached", type: "date", validation: (rule) => rule.required() }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    imageField("thumbnail", "Thumbnail"),
    defineField({
      name: "videoUrl",
      title: "Video URL",
      type: "url",
      description: "YouTube link. Plays inside the page when someone presses play.",
    }),
    defineField({ name: "audio", title: "Audio File", type: "file", options: { accept: "audio/*" } }),
    defineField({ name: "duration", title: "Duration", type: "string", description: 'e.g. "45:20"' }),
  ],
  orderings: [{ title: "Newest first", name: "dateDesc", by: [{ field: "date", direction: "desc" }] }],
  preview: { select: { title: "title", subtitle: "speaker", media: "thumbnail" } },
});
