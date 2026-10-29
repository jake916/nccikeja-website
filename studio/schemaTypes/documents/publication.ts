import { BookIcon } from "@sanity/icons/Book";
import { BlockquoteIcon } from "@sanity/icons/Blockquote";
import { defineArrayMember, defineField, defineType } from "sanity";

import { imageField } from "../shared/image-field";

export const PUBLICATION_TYPES = [
  { title: "Book", value: "book" },
  { title: "E-Book", value: "ebook" },
  { title: "Article", value: "article" },
  { title: "Daily Devotional", value: "devotional" },
  { title: "Study Guide", value: "studyGuide" },
  { title: "Audio Series", value: "audioSeries" },
];

export const publication = defineType({
  name: "publication",
  title: "Publication",
  type: "document",
  icon: BookIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "files", title: "Files & Links" },
    { name: "listing", title: "Listing" },
  ],
  fields: [
    defineField({
      name: "kind",
      title: "Type",
      type: "string",
      options: { list: PUBLICATION_TYPES, layout: "radio" },
      validation: (rule) => rule.required(),
      group: "content",
    }),
    defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required(), group: "content" }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
      group: "content",
    }),
    defineField({ name: "subtitle", title: "Subtitle", type: "string", group: "content" }),
    defineField({ name: "category", title: "Category", type: "string", description: 'e.g. "Theology", "Spiritual Growth"', group: "content" }),
    defineField({ name: "publishedAt", title: "Published", type: "date", validation: (rule) => rule.required(), group: "content" }),
    defineField({ name: "readingTime", title: "Reading Time (minutes)", type: "number", group: "content" }),
    defineField({
      name: "author",
      title: "Author",
      type: "object",
      group: "content",
      fields: [
        defineField({ name: "name", title: "Name", type: "string" }),
        imageField("photo", "Photo"),
      ],
    }),
    { ...imageField("coverImage", "Cover / Hero Image"), group: "content" },
    defineField({ name: "excerpt", title: "Excerpt", type: "text", rows: 3, description: "Shown on listing cards", group: "content" }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Lead paragraph", value: "lead" },
            { title: "Heading", value: "h2" },
            { title: "Subheading", value: "h3" },
          ],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
        }),
        defineArrayMember({
          name: "scripture",
          title: "Scripture Quote",
          type: "object",
          icon: BlockquoteIcon,
          fields: [
            defineField({ name: "text", title: "Text", type: "text", rows: 3 }),
            defineField({ name: "reference", title: "Reference", type: "string", description: 'e.g. "Proverbs 4:7"' }),
          ],
          preview: { select: { title: "text", subtitle: "reference" } },
        }),
      ],
    }),
    defineField({ name: "keyThemes", title: "Key Themes", type: "array", of: [{ type: "string" }], group: "content" }),

    defineField({ name: "pdf", title: "PDF File", type: "file", options: { accept: "application/pdf" }, group: "files" }),
    defineField({ name: "epub", title: "EPUB File", type: "file", options: { accept: ".epub" }, group: "files" }),
    defineField({ name: "audio", title: "Audio File", type: "file", options: { accept: "audio/*" }, group: "files" }),
    defineField({ name: "purchaseUrl", title: "Get a Copy Link", type: "url", group: "files" }),
    defineField({ name: "sampleUrl", title: "Read a Sample Link", type: "url", group: "files" }),

    { ...imageField("cardImage", "Listing Image", "Optional: used on listing cards instead of the cover"), group: "listing" },
    defineField({ name: "featured", title: "Feature at the top of the library", type: "boolean", initialValue: false, group: "listing" }),
    defineField({
      name: "related",
      title: "Related Resources",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "publication" }] })],
      validation: (rule) => rule.max(3),
      group: "listing",
    }),
  ],
  orderings: [{ title: "Newest first", name: "publishedDesc", by: [{ field: "publishedAt", direction: "desc" }] }],
  preview: { select: { title: "title", subtitle: "kind", media: "coverImage" } },
});
