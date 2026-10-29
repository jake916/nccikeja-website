"use client";

import Image from "next/image";
import { useActionState, useState } from "react";

import { Honeypot, SelectField, TextArea, TextField } from "@/components/forms/fields";
import { SubmitButton } from "@/components/forms/submit-button";
import { SuccessDialog } from "@/components/forms/success-dialog";
import type { FormState } from "@/lib/forms/submission";

import { shareTestimony } from "./actions";

export function TestimonyForm({ expressions, categories }: { expressions: string[]; categories: string[] }) {
  const [state, action] = useActionState<FormState, FormData>(shareTestimony, { status: "idle" });
  const [dismissed, setDismissed] = useState<FormState | null>(null);
  const errors = state.errors ?? {};
  const failed = state.status === "error" && !state.errors && dismissed !== state;

  return (
    <>
      <form action={action} noValidate className="relative flex flex-col gap-6">
        <Honeypot />
        <div className="grid gap-x-6 gap-y-6 sm:grid-cols-2">
          <TextField look="gray" label="Full Name" name="fullName" placeholder="John Doe" autoComplete="name" required error={errors.fullName} />
          <TextField look="gray" label="Email Address" name="email" type="email" placeholder="john@example.com" autoComplete="email" required error={errors.email} />
          <SelectField look="gray" label="Expression (Campus)" name="expression" placeholder="Select your expression..." options={expressions} />
          <TextField look="gray" label="Phone Number" name="phone" type="tel" placeholder="+234 800 000 0000" autoComplete="tel" />
        </div>
        <SelectField look="gray" label="Category" name="category" placeholder="Select a category..." options={categories} />
        <TextArea look="gray" label="Your Testimony" name="story" placeholder="Tell us what God has done in your life..." required error={errors.story} />
        <div className="flex justify-end pt-4">
          <SubmitButton shape="rounded" className="bg-[#d4e815] px-8 py-3.5 leading-6 text-[#1f2937] shadow-none hover:bg-[#c3d60f]">
            Submit Testimony
            <Image src="/icons/testimony/arrow.svg" alt="" width={13.5} height={11.25} />
          </SubmitButton>
        </div>
      </form>

      {state.status === "success" && (
        <SuccessDialog
          variant="simple"
          title="Testimony Received!"
          message="Thank you for sharing your story of God's faithfulness. Your testimony will be reviewed and shared to inspire our community."
        />
      )}
      {failed && (
        <SuccessDialog variant="status" tone="error" message={"Something went wrong, and your testimony wasn't submitted.\nPlease try again."} onClose={() => setDismissed(state)} />
      )}
    </>
  );
}
