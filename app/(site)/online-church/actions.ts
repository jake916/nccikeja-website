"use server";

import { deliverSubmission, isSpam, readFields, saveSubmission, type FormState } from "@/lib/forms/submission";

export async function postChatMessage(name: string, text: string): Promise<FormState> {
  const cleanName = name.trim().slice(0, 40);
  const cleanText = text.trim().slice(0, 500);
  if (!cleanName || !cleanText) return { status: "error", message: "Please enter your name and a message." };

  return saveSubmission({ _type: "chatMessage", name: cleanName, text: cleanText, moderator: false, postedAt: new Date().toISOString() });
}

export async function submitPrayer(_prev: FormState, formData: FormData): Promise<FormState> {
  if (isSpam(formData)) return { status: "success" };

  const anonymous = formData.get("anonymous") === "on";
  const followUp = formData.get("followUp") === "on";
  const { values, errors } = readFields(formData, {
    name: { required: !anonymous, max: 120 },
    email: { required: followUp, email: true, max: 160 },
    category: { max: 80 },
    request: { required: true, max: 4000 },
  });
  if (errors) return { status: "error", errors };

  const name = anonymous ? undefined : values.name;
  const result = await deliverSubmission(
    {
      _type: "prayerRequest",
      anonymous,
      name,
      email: values.email || undefined,
      category: values.category || undefined,
      request: values.request,
      followUp,
    },
    {
      to: process.env.PRAYER_EMAIL_TO,
      subject: `Prayer request from ${name ?? "Anonymous"}${values.category ? ` · ${values.category}` : ""}${followUp ? " · follow-up requested" : ""}`,
      heading: "New Prayer Request",
      intro: `${name ?? "Someone"} sent a prayer request through the website${anonymous ? " anonymously" : ""}.`,
      replyTo: values.email || undefined,
      fields: [
        ["Name", name ?? "Anonymous"],
        ["Email", values.email],
        ["Category", values.category],
        ["Wants someone to follow up", followUp ? "Yes" : "No"],
        ["Prayer request", values.request],
      ],
      // Only when they left an email; anonymous requests without one get no confirmation.
      confirmation: values.email
        ? {
            to: values.email,
            name: name?.split(/\s+/)[0] ?? "Friend",
            subject: "We've received your prayer request",
            heading: "Prayer Request Received",
            paragraphs: [
              followUp
                ? "Thank you for trusting us with this. Your request has been received, and a member of our pastoral care team will reach out to you."
                : "Thank you for trusting us with this. Your request has been received, and our prayer team will stand with you in faith.",
            ],
            fields: [["Your prayer request", values.request]],
            reason: "you sent a prayer request",
          }
        : undefined,
    },
  );
  return result.status === "success" ? { status: "success", message: followUp ? "followUp" : undefined } : result;
}
