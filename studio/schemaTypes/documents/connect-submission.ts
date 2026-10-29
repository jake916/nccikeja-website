import { UserIcon } from "@sanity/icons/User";
import { defineField, defineType } from "sanity";

/** Submitted from the website's "Connect With Us" form (first-time visitors and returning members). */
export const connectSubmission = defineType({
  name: "connectSubmission",
  title: "Connect Card",
  type: "document",
  icon: UserIcon,
  readOnly: true,
  fields: [
    defineField({
      name: "visitorType",
      title: "Visitor Type",
      type: "string",
      options: { list: [{ title: "First Time Visitor", value: "firstTime" }, { title: "Returning Member", value: "returning" }] },
    }),
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "firstName", title: "First Name", type: "string" }),
    defineField({ name: "lastName", title: "Last Name", type: "string" }),
    defineField({ name: "gender", title: "Gender", type: "string" }),
    defineField({ name: "dateOfBirth", title: "Date of Birth / Age Range", type: "string" }),
    defineField({ name: "maritalStatus", title: "Marital Status", type: "string" }),
    defineField({ name: "occupation", title: "Occupation", type: "string" }),
    defineField({ name: "phone", title: "Phone", type: "string" }),
    defineField({ name: "whatsapp", title: "WhatsApp", type: "string" }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({ name: "contactPreference", title: "Best way to reach", type: "string" }),
    defineField({ name: "address", title: "Home Address", type: "string" }),
    defineField({ name: "area", title: "Area", type: "string" }),
    defineField({ name: "city", title: "City", type: "string" }),
    defineField({ name: "state", title: "State", type: "string" }),
    defineField({ name: "visitDate", title: "Visit Date", type: "date" }),
    defineField({ name: "heardFrom", title: "Heard about us from", type: "string" }),
    defineField({ name: "interests", title: "Interests", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "followUp", title: "Follow-up preference", type: "string" }),
    defineField({ name: "isMember", title: "Member of this centre", type: "string" }),
    defineField({ name: "joinedDate", title: "Joined", type: "string" }),
    defineField({ name: "department", title: "Department", type: "string" }),
    defineField({ name: "academyLevel", title: "Academy level completed", type: "string" }),
    defineField({ name: "requestType", title: "Request type", type: "string" }),
    defineField({ name: "message", title: "Message", type: "text" }),
    defineField({ name: "submittedAt", title: "Submitted", type: "datetime" }),
  ],
  orderings: [{ title: "Newest first", name: "submittedDesc", by: [{ field: "submittedAt", direction: "desc" }] }],
  preview: {
    select: { first: "firstName", last: "lastName", type: "visitorType" },
    prepare: ({ first, last, type }) => ({
      title: [first, last].filter(Boolean).join(" "),
      subtitle: type === "returning" ? "Returning member" : "First time visitor",
    }),
  },
});
