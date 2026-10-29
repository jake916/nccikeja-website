import { defineField } from "sanity";

/** Image with hotspot cropping and alt text, used for every photo on the site. */
export function imageField(name: string, title: string, description?: string) {
  return defineField({
    name,
    title,
    description,
    type: "image",
    options: { hotspot: true },
    fields: [
      defineField({
        name: "alt",
        title: "Alternative Text",
        type: "string",
        description: "Describe the photo for screen readers. Leave empty if it's purely decorative.",
      }),
    ],
  });
}
