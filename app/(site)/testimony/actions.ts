"use server";

import { deliverSubmission, isSpam, readFields, type FormState } from "@/lib/forms/submission";

export async function shareTestimony(_prev: FormState, formData: FormData): Promise<FormState> {
  if (isSpam(formData)) return { status: "success" };

  const { values, errors } = readFields(formData, {
    fullName: { required: true, max: 120 },
    email: { required: true, email: true, max: 160 },
    phone: { max: 40 },
    expression: { max: 80 },
    category: { max: 60 },
    story: { required: true, max: 6000 },
  });
  if (errors) return { status: "error", errors };

  return deliverSubmission(
    { _type: "testimony", ...Object.fromEntries(Object.entries(values).filter(([, v]) => v)) },
    {
      to: process.env.TESTIMONY_EMAIL_TO,
      subject: `New testimony from ${values.fullName}${values.category ? ` · ${values.category}` : ""}`,
      heading: "New Testimony",
      intro: `${values.fullName} shared a testimony through the website.`,
      replyTo: values.email,
      fields: [
        ["Full name", values.fullName],
        ["Email", values.email],
        ["Phone", values.phone],
        ["Expression (campus)", values.expression],
        ["Category", values.category],
        ["Testimony", values.story],
      ],
      confirmation: {
        to: values.email,
        name: values.fullName.split(/\s+/)[0],
        subject: "Thank you for sharing your testimony",
        heading: "Testimony Received",
        paragraphs: [
          "Thank you for sharing your story of God's faithfulness with us. We've received your testimony, and our team will review it.",
          "Every testimony is proof that God is still at work. Yours may be shared with our church family to encourage and inspire others, and we rejoice with you.",
        ],
        fields: [
          ["Category", values.category],
          ["Your testimony", values.story],
        ],
        reason: "you shared a testimony",
      },
    },
  );
}
