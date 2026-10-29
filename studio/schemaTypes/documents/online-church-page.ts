import { PlayIcon } from "@sanity/icons/Play";
import { defineArrayMember, defineField, defineType } from "sanity";

import { imageField } from "../shared/image-field";

export const onlineChurchPage = defineType({
  name: "onlineChurchPage",
  title: "Online Church Page",
  type: "document",
  icon: PlayIcon,
  fields: [
    defineField({
      name: "isLive",
      title: "Service is live now",
      type: "boolean",
      initialValue: false,
      description: "While on, the live stream plays embedded on the Online Church page.",
    }),
    defineField({
      name: "streamUrl",
      title: "Live Stream URL",
      type: "url",
      description:
        "YouTube link. Use https://www.youtube.com/channel/<channel id>/live to always show the channel's current live stream, or a video link for a specific service.",
    }),
    defineField({ name: "streamTitle", title: "Service Title", type: "string" }),
    defineField({ name: "streamSubtitle", title: "Speaker / Message", type: "string", description: 'e.g. "Pastor John Doe • The Power of Grace"' }),
    imageField("poster", "Video Poster Image"),
    defineField({
      name: "keyScriptures",
      title: "Key Scriptures",
      type: "array",
      of: [
        defineArrayMember({
          name: "keyScripture",
          type: "object",
          fields: [
            defineField({ name: "reference", title: "Reference", type: "string" }),
            defineField({ name: "text", title: "Text", type: "text", rows: 3 }),
          ],
          preview: { select: { title: "reference", subtitle: "text" } },
        }),
      ],
    }),
    defineField({ name: "prayerHeading", title: "Prayer Page Heading", type: "string" }),
    defineField({ name: "prayerText", title: "Prayer Page Text", type: "text", rows: 2 }),
    imageField("prayerImage", "Prayer Page Hero Image"),
    defineField({
      name: "prayerCategories",
      title: "Prayer Categories",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({ name: "connectHeading", title: "Connect Page Heading", type: "string" }),
    defineField({ name: "connectText", title: "Connect Page Text", type: "text", rows: 2 }),
    imageField("connectImage", "Connect Page Hero Image"),
    defineField({ name: "departments", title: "Departments / Units", type: "array", of: [{ type: "string" }] }),
  ],
  preview: { prepare: () => ({ title: "Online Church Page" }) },
});
