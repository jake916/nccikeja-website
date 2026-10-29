"use client";

import { useActionState } from "react";

import { Honeypot, SelectField, TextArea, TextField } from "@/components/forms/fields";
import { SubmitButton } from "@/components/forms/submit-button";
import { SuccessDialog } from "@/components/forms/success-dialog";
import type { FormState } from "@/lib/forms/submission";

import { enrol } from "./actions";

export function EnrolForm({
  courses,
  success,
}: {
  courses: { value: string; label: string }[];
  success: { title: string; message: string | null; nextSteps: string[] | null };
}) {
  const [state, action] = useActionState<FormState, FormData>(enrol, { status: "idle" });
  const errors = state.errors ?? {};

  return (
    <>
      <form action={action} noValidate className="relative flex flex-col gap-6">
        <Honeypot />
        <TextField label="Full Name" name="fullName" autoComplete="name" required error={errors.fullName} />
        <div className="grid gap-6 sm:grid-cols-2">
          <TextField label="Email Address" name="email" type="email" autoComplete="email" required error={errors.email} />
          <TextField label="Phone Number" name="phone" type="tel" autoComplete="tel" required error={errors.phone} />
        </div>
        <SelectField
          label="Course Level Selection"
          name="course"
          placeholder="Select a course level"
          options={courses}
          required
          error={errors.course}
        />
        <TextArea
          label="Personal Statement"
          name="statement"
          hint="Why do you want to join this course?"
          error={errors.statement}
          className="pb-5"
        />
        {state.status === "error" && state.message && (
          <p role="alert" className="rounded-lg bg-brand-red/5 p-4 text-sm text-brand-red">
            {state.message}
          </p>
        )}
        <SubmitButton size="form" className="w-full py-4 leading-4">
          Submit Enrollment
        </SubmitButton>
      </form>

      {state.status === "success" && <SuccessDialog title={success.title} message={success.message} nextSteps={success.nextSteps} />}
    </>
  );
}
