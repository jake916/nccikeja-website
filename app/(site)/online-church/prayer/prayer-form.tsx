"use client";

import Image from "next/image";
import { useActionState, useState } from "react";

import { Honeypot, SelectField, TextArea, TextField } from "@/components/forms/fields";
import { SubmitButton } from "@/components/forms/submit-button";
import { SuccessDialog } from "@/components/forms/success-dialog";
import type { FormState } from "@/lib/forms/submission";

import { submitPrayer } from "../actions";

const messages = {
  success: "Thank you for trusting us with this.\nYour request has been received, and our prayer team will stand with you in faith.",
  followUp: "Thank you. Your request has been received, and a member of our pastoral care team will reach out to you.",
  error: "Something went wrong, and your request wasn't submitted.\nPlease try again.",
};

export function PrayerForm({ categories }: { categories: string[] }) {
  const [state, action] = useActionState<FormState, FormData>(submitPrayer, { status: "idle" });
  const [anonymous, setAnonymous] = useState(false);
  const [dismissed, setDismissed] = useState<FormState | null>(null);
  const errors = state.errors ?? {};
  const failed = state.status === "error" && !state.errors && dismissed !== state;

  return (
    <>
      <form action={action} noValidate className="relative flex flex-col gap-6">
        <Honeypot />
        <label className="flex cursor-pointer items-center justify-end gap-1 text-sm leading-5 font-medium tracking-[0.01em] text-muted">
          Submit Anonymously
          <input type="checkbox" name="anonymous" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} className="peer sr-only" />
          <span className="relative ml-1 h-6 w-10 rounded-full bg-[#e4e1e6] transition-colors peer-checked:bg-navy peer-focus-visible:outline-2 peer-focus-visible:outline-navy after:absolute after:top-1 after:left-1 after:size-4 after:rounded-full after:bg-surface-bright after:transition-transform peer-checked:after:translate-x-4" />
        </label>
        <div className="grid gap-6 sm:grid-cols-2">
          <TextField look="soft" label="Full Name" name="name" placeholder="Jane Doe" autoComplete="name" disabled={anonymous} error={errors.name} />
          <TextField look="soft" label="Email Address" name="email" type="email" placeholder="jane@example.com" autoComplete="email" error={errors.email} />
        </div>
        <SelectField look="soft" label="Prayer Category" name="category" placeholder="Select an area of focus" options={categories} error={errors.category} />
        <TextArea look="soft" label="Your Prayer Request" name="request" placeholder="Share what is on your heart..." required height="min-h-[146px]" error={errors.request} />
        <label className="flex items-center gap-3 pb-3 text-sm leading-5 font-medium tracking-[0.01em] text-ink">
          <input type="checkbox" name="followUp" className="size-4 rounded accent-navy" />
          I would like a member of the pastoral care team to follow up with me
        </label>
        <SubmitButton variant="navy" shape="square" size="form" className="w-full py-6 leading-4 shadow-none">
          Submit Prayer Request
          <Image src="/icons/online/send-arrow.svg" alt="" width={15.833} height={13.333} />
        </SubmitButton>
      </form>

      {state.status === "success" && (
        <SuccessDialog variant="status" title="Successful!" message={state.message === "followUp" ? messages.followUp : messages.success} />
      )}
      {failed && <SuccessDialog variant="status" tone="error" message={messages.error} onClose={() => setDismissed(state)} />}
    </>
  );
}
