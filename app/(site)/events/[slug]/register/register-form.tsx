"use client";

import Image from "next/image";
import { useActionState, useState } from "react";

import { Honeypot, SelectField, TextField } from "@/components/forms/fields";
import { SubmitButton } from "@/components/forms/submit-button";
import { SuccessDialog } from "@/components/forms/success-dialog";
import { heardFrom } from "@/lib/forms/options";
import type { FormState } from "@/lib/forms/submission";

import { registerForEvent } from "./actions";

export function RegisterForm({ eventSlug, eventTitle }: { eventSlug: string; eventTitle: string }) {
  const [state, action] = useActionState<FormState, FormData>(registerForEvent.bind(null, eventSlug), { status: "idle" });
  const [dismissed, setDismissed] = useState<FormState | null>(null);
  const errors = state.errors ?? {};
  const failed = state.status === "error" && !state.errors && dismissed !== state;

  return (
    <>
      <form action={action} noValidate className="relative flex flex-col gap-6">
        <Honeypot />
        <div className="grid gap-6 sm:grid-cols-2">
          <TextField look="soft" label="Full Name" name="fullName" placeholder="Jane Doe" autoComplete="name" required error={errors.fullName} />
          <TextField look="soft" label="Email Address" name="email" type="email" placeholder="jane@example.com" autoComplete="email" required error={errors.email} />
          <TextField look="soft" label="Phone Number" name="phone" type="tel" placeholder="+234 XXX XXX XXXX" autoComplete="tel" required error={errors.phone} />
          <SelectField look="soft" label="How did you hear about us?" name="heardFrom" placeholder="Select an option" options={heardFrom} />
        </div>
        <SubmitButton variant="navy" shape="rounded" size="form" className="w-full py-3 leading-4 shadow-[0_8px_20px_rgb(21_26_75/0.08)]">
          Complete Registration
          <Image src="/icons/events/arrow-white.svg" alt="" width={13.333} height={13.333} />
        </SubmitButton>
      </form>

      {state.status === "success" && (
        <SuccessDialog variant="status" title="Registration Successful!" message={`We've received your registration for the ${eventTitle}. See you there!`} />
      )}
      {failed && (
        <SuccessDialog variant="status" tone="error" message={"Something went wrong, and your registration wasn't submitted.\nPlease try again."} onClose={() => setDismissed(state)} />
      )}
    </>
  );
}
