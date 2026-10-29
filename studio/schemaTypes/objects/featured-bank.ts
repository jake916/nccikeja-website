import { CreditCardIcon } from "@sanity/icons/CreditCard";
import { defineArrayMember, defineField, defineType } from "sanity";

export const featuredBank = defineType({
  name: "featuredBank",
  title: "Featured Bank",
  type: "object",
  icon: CreditCardIcon,
  fields: [
    defineField({ name: "name", title: "Bank Name", type: "string" }),
    defineField({
      name: "accounts",
      title: "Accounts",
      type: "array",
      of: [
        defineArrayMember({
          name: "featuredAccount",
          type: "object",
          fields: [
            defineField({ name: "label", title: "Purpose", type: "string", description: 'e.g. "Offering/Tithe"' }),
            defineField({
              name: "number",
              title: "Account Number",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: "number", subtitle: "label" } },
        }),
      ],
    }),
  ],
});
