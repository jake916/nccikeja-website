import { LinkIcon } from "@sanity/icons/Link";
import { defineField, defineType } from "sanity";

const platforms = [
  ["facebook", "Facebook"],
  ["tiktok", "TikTok"],
  ["instagram", "Instagram"],
  ["spotify", "Spotify"],
  ["youtube", "YouTube"],
] as const;

export const socialLinks = defineType({
  name: "socialLinks",
  title: "Social Links",
  type: "object",
  icon: LinkIcon,
  fields: platforms.map(([name, title]) => defineField({ name, title, type: "url" })),
});
