import { CommentIcon } from "@sanity/icons/Comment";
import { defineField, defineType } from "sanity";

/** Fellowship chat on the Online Church page. Delete a message here to remove it from the chat. */
export const chatMessage = defineType({
  name: "chatMessage",
  title: "Chat Message",
  type: "document",
  icon: CommentIcon,
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "text", title: "Message", type: "text", rows: 2, validation: (rule) => rule.required().max(500) }),
    defineField({ name: "moderator", title: "Post as moderator", type: "boolean", initialValue: true }),
    defineField({ name: "postedAt", title: "Posted", type: "datetime", initialValue: () => new Date().toISOString() }),
  ],
  orderings: [{ title: "Newest first", name: "postedDesc", by: [{ field: "postedAt", direction: "desc" }] }],
  preview: { select: { title: "text", subtitle: "name" } },
});
