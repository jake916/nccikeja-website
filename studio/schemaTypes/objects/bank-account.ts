import { CreditCardIcon } from "@sanity/icons/CreditCard";
import { defineField, defineType } from "sanity";

const accountFields = [
  defineField({ name: "bank", title: "Bank", type: "string" }),
  defineField({ name: "label", title: "Purpose", type: "string", description: 'e.g. "Building account"' }),
  defineField({
    name: "number",
    title: "Account Number",
    type: "string",
    validation: (rule) => rule.required(),
  }),
];

const preview = {
  select: { bank: "bank", label: "label", number: "number" },
  prepare: ({ bank, label, number }: { bank?: string; label?: string; number?: string }) => ({
    title: number,
    subtitle: [bank, label].filter(Boolean).join(" | "),
  }),
};

export const bankAccount = defineType({
  name: "bankAccount",
  title: "Naira Account",
  type: "object",
  icon: CreditCardIcon,
  fields: accountFields,
  preview,
});

export const domiciliaryAccount = defineType({
  name: "domiciliaryAccount",
  title: "Domiciliary Account",
  type: "object",
  icon: CreditCardIcon,
  fields: accountFields.map((field) =>
    field.name === "label" ? { ...field, title: "Purpose / Currency", description: 'e.g. "USD"' } : field,
  ),
  preview,
});
