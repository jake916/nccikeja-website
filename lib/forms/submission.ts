import "server-only";

import { writeClient } from "@/sanity/lib/write-client";

import { sendSubmissionEmail, type SubmissionEmail } from "./email";

export type FormState = { status: "idle" | "success" | "error"; message?: string; errors?: Record<string, string> };

export const initialFormState: FormState = { status: "idle" };

type FieldRule = { required?: boolean; max?: number; email?: boolean };

/**
 * Reads and validates text fields from a submitted form.
 * Returns the cleaned values, or field errors to show next to the inputs.
 */
export function readFields<K extends string>(formData: FormData, rules: Record<K, FieldRule>) {
  const values = {} as Record<K, string>;
  const errors: Record<string, string> = {};

  for (const [name, rule] of Object.entries(rules) as [K, FieldRule][]) {
    const value = String(formData.get(name) ?? "").trim();
    const max = rule.max ?? 200;
    if (rule.required && !value) errors[name] = "This field is required.";
    else if (value.length > max) errors[name] = `Please keep this under ${max} characters.`;
    else if (rule.email && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) errors[name] = "Enter a valid email address.";
    values[name] = value;
  }

  return { values, errors: Object.keys(errors).length ? errors : null };
}

/** Bots fill every input, including the hidden "website" honeypot that people never see. */
export function isSpam(formData: FormData) {
  return Boolean(formData.get("website"));
}

/** Saves a submission document to Sanity. */
export async function saveSubmission(doc: { _type: string } & Record<string, unknown>): Promise<FormState> {
  if (!writeClient) {
    return { status: "error", message: "Submissions are temporarily unavailable. Please try again later." };
  }
  try {
    await writeClient.create({ ...doc, submittedAt: new Date().toISOString() });
    return { status: "success" };
  } catch (error) {
    console.error("Failed to save form submission", error);
    return { status: "error", message: "Something went wrong while sending your form. Please try again." };
  }
}

/**
 * Saves the submission to Sanity and emails it to the team at the same time.
 * Counts as sent if either one gets through, so a Sanity or Resend outage alone doesn't lose it.
 */
export async function deliverSubmission(
  doc: { _type: string } & Record<string, unknown>,
  email: SubmissionEmail,
): Promise<FormState> {
  const [saved, sent] = await Promise.all([saveSubmission(doc), sendSubmissionEmail(email)]);
  return sent ? { status: "success" } : saved;
}
