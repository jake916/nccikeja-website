"use client";

import Image from "next/image";
import { useActionState, useRef, useState } from "react";

import { Honeypot, SelectField, TextArea, TextField } from "@/components/forms/fields";
import { SubmitButton } from "@/components/forms/submit-button";
import { SuccessDialog } from "@/components/forms/success-dialog";
import { cn } from "@/lib/cn";
import * as opts from "@/lib/forms/options";
import type { FormState } from "@/lib/forms/submission";

import { submitConnect } from "./actions";

type Tab = "firstTime" | "returning";

const icons = {
  phone: { src: "/icons/connect/phone.svg", width: 30, height: 44 },
  whatsapp: { src: "/icons/connect/whatsapp.svg", width: 30, height: 44 },
  mail: { src: "/icons/connect/mail.svg", width: 30, height: 44 },
};

export function ConnectForm({ departments }: { departments: string[] }) {
  const [tab, setTab] = useState<Tab>("firstTime");
  const [state, action] = useActionState<FormState, FormData>(submitConnect, { status: "idle" });
  const [dismissed, setDismissed] = useState<FormState | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const errors = state.errors ?? {};
  const failed = state.status === "error" && !state.errors && dismissed !== state;
  const returning = tab === "returning";

  function copyPhone(checked: boolean) {
    const form = formRef.current;
    if (!form) return;
    const phone = form.elements.namedItem("phone") as HTMLInputElement;
    const whatsapp = form.elements.namedItem("whatsapp") as HTMLInputElement;
    whatsapp.value = checked ? phone.value : "";
  }

  return (
    <>
      <div className="flex justify-center px-6 pt-10 pb-4 sm:px-12">
        <div role="tablist" aria-label="Who are you?" className="flex rounded-xl bg-[#f1f5f9] p-1.5 shadow-[0_2px_4px_rgb(0_0_0/0.05)]">
          {(
            [
              ["firstTime", "First Time Visitor"],
              ["returning", "Returning Member"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={tab === value}
              onClick={() => setTab(value)}
              className={cn(
                "rounded-lg px-5 py-3 text-sm leading-5 transition-colors sm:px-8",
                tab === value ? "bg-navy font-semibold text-white shadow-[0_1px_2px_rgb(0_0_0/0.1),0_1px_3px_rgb(0_0_0/0.1)]" : "font-medium text-[#475569] hover:text-navy",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <form ref={formRef} key={tab} action={action} noValidate className="relative flex flex-col gap-8 px-6 pt-4 pb-14 sm:px-14">
        <Honeypot />
        <input type="hidden" name="visitorType" value={tab} />
        <p className="text-center leading-6 text-black">
          Welcome! We&apos;re glad you found us.
          <br />
          Tell us a little about yourself and we&apos;ll help you feel at home.
        </p>

        <FormSection number={1} title="About You" required>
          <div className="grid gap-6 sm:grid-cols-3">
            <SelectField look="slate" label="Title" name="title" placeholder="Select" options={opts.titles} />
            <TextField look="slate" label="First Name *" name="firstName" placeholder="e.g. Adebayo" autoComplete="given-name" required error={errors.firstName} />
            <TextField look="slate" label="Last Name *" name="lastName" placeholder="e.g. Johnson" autoComplete="family-name" required error={errors.lastName} />
            <SelectField look="slate" label="Gender *" name="gender" placeholder="Select" options={opts.genders} required error={errors.gender} />
            {returning ? (
              <SelectField look="slate" label="Date of Birth / Age Range" name="dateOfBirth" placeholder="Select or Age Range" options={opts.ageRanges} />
            ) : (
              <TextField look="slate" label="Date of Birth" name="dateOfBirth" type="date" placeholder="DD/MM/YYYY" />
            )}
            <SelectField look="slate" label="Marital Status" name="maritalStatus" placeholder="Select" options={opts.maritalStatuses} />
          </div>
          <TextField look="slate" label="Occupation" name="occupation" placeholder="e.g. Teacher, Student, Business Owner" />
        </FormSection>

        <FormSection number={2} title="How to Reach You">
          <div className="grid gap-6 sm:grid-cols-2">
            <TextField look="slate" label="Phone Number *" name="phone" type="tel" placeholder="e.g. +234 800 000 0000" autoComplete="tel" icon={icons.phone} required error={errors.phone} />
            <TextField
              look="slate"
              label="WhatsApp Number"
              name="whatsapp"
              type="tel"
              placeholder="e.g. +234 800 000 0000"
              icon={icons.whatsapp}
              aside={
                <label className="flex items-center gap-1.5 text-xs leading-4 text-[#64748b]">
                  <input type="checkbox" onChange={(e) => copyPhone(e.target.checked)} className="size-3.5 rounded accent-navy" />
                  Same as phone
                </label>
              }
            />
          </div>
          <TextField look="slate" label="Email Address *" name="email" type="email" placeholder="e.g. name@example.com" autoComplete="email" icon={icons.mail} required error={errors.email} />
          <RadioGroup label="Best way to reach you" name="contactPreference" options={["Phone call", "WhatsApp", "Email"]} defaultValue="WhatsApp" />
        </FormSection>

        <FormSection number={3} title="Where You Live">
          <TextField look="slate" label="Home Address" name="address" placeholder="House number and street" autoComplete="street-address" />
          <div className="grid gap-6 sm:grid-cols-2">
            <TextField look="slate" label="Area / Neighbourhood" name="area" placeholder="e.g. Ikeja GRA, Maryland, Alausa" />
            <TextField look="slate" label="City" name="city" placeholder="e.g. Ikeja" autoComplete="address-level2" />
          </div>
          <SelectField look="slate" label="State" name="state" placeholder="Select" options={opts.nigerianStates} />
        </FormSection>

        {returning ? (
          <>
            <FormSection number={4} title="Church Involvement">
              <div className="grid gap-6 sm:grid-cols-2">
                <RadioGroup label="Are you a member of this centre? *" name="isMember" options={["Yes", "No", "Not sure"]} error={errors.isMember} />
                <TextField look="slate" label="When did you join? (optional)" name="joinedDate" placeholder="DD/MM/YYYY" />
              </div>
              <SelectField look="slate" label="Department or Unit" name="department" placeholder="Select your unit or department" options={departments} />
              <PillGroup label="World Changers Academy level completed" name="academyLevel" options={["None yet", "100", "200", "300", "400", "500"]} />
            </FormSection>
            <FormSection number={5} title="Your Request">
              <SelectField look="slate" label="What can we help you with? *" name="requestType" placeholder="Select a request type" options={opts.requestTypes} required error={errors.requestType} />
              <TextArea look="slate" label="Tell us more" name="message" placeholder="Share your question, update or request with us..." height="min-h-[110px]" />
            </FormSection>
          </>
        ) : (
          <FormSection number={4} title="Your Visit">
            <div className="grid gap-6 sm:grid-cols-2">
              <TextField look="slate" label="When did you visit, or when are you planning to?" name="visitDate" type="date" />
              <SelectField look="slate" label="How did you hear about us?" name="heardFrom" placeholder="Select an option" options={opts.heardFrom} />
            </div>
            <fieldset className="flex flex-col gap-3 pt-2">
              <legend className="pb-3 text-xs leading-4 font-semibold text-[#334155]">What are you interested in? (Select all that apply)</legend>
              <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
                {opts.interests.map((interest) => (
                  <label
                    key={interest}
                    className="flex min-h-[58px] cursor-pointer items-center gap-2.5 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-3 text-xs leading-4 font-medium text-[#334155] shadow-[0_1px_2px_rgb(0_0_0/0.05)] has-checked:border-navy/40"
                  >
                    <input type="checkbox" name="interests" value={interest} className="size-4 shrink-0 rounded accent-navy" />
                    {interest}
                  </label>
                ))}
              </div>
            </fieldset>
            <RadioGroup label="Would you like someone to visit or call you?" name="followUp" options={["Call me", "Visit me", "No follow-up needed"]} defaultValue="Call me" />
            <TextArea
              look="slate"
              label="How can we help you? (optional)"
              name="message"
              placeholder="Tell us what you'd like to know, or how we can support your first visit..."
              height="min-h-[110px]"
            />
          </FormSection>
        )}

        <div className="flex flex-col gap-1">
          <label className="flex items-center gap-3 text-sm leading-5 text-[#475569]">
            <input type="checkbox" name="consent" className="size-4 rounded accent-navy" aria-invalid={errors.consent ? true : undefined} />
            <span>
              I agree to be contacted by <strong className="font-semibold text-navy">New Covenant Church Ikeja</strong>.
            </span>
          </label>
          {errors.consent && <p className="text-sm text-brand-red">{errors.consent}</p>}
        </div>

        <div className="flex justify-end pt-4">
          <SubmitButton variant="navy" shape="rounded" className="px-8 py-3.5 text-sm leading-5 shadow-none">
            Send Message
            <Image src="/icons/online/send-arrow.svg" alt="" width={15.833} height={13.333} />
          </SubmitButton>
        </div>
      </form>

      {state.status === "success" && (
        <SuccessDialog
          variant="status"
          title={state.message ? `Thank You, ${state.message}!` : "Thank You!"}
          message="We've received your message and a member of our team will be in touch soon."
        />
      )}
      {failed && (
        <SuccessDialog variant="status" tone="error" message={"Something went wrong, and your message wasn't sent.\nPlease try again"} onClose={() => setDismissed(state)} />
      )}
    </>
  );
}

function FormSection({ number, title, required, children }: { number: number; title: string; required?: boolean; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-6">
      <header className="flex items-end justify-between border-b border-[#e2e8f0] pb-3">
        <div className="flex flex-col items-start gap-0.5">
          <span className="rounded-md bg-[#eff6ff] px-2.5 py-1 text-[11px] leading-4 font-bold tracking-wide text-[#1e40af] uppercase">Section {number}</span>
          <h2 className="text-xl leading-7 font-bold text-navy">{title}</h2>
        </div>
        {required && <span className="text-xs leading-4 text-[#94a3b8]">* Required fields</span>}
      </header>
      <div className="flex flex-col gap-6">{children}</div>
    </section>
  );
}

function RadioGroup({ label, name, options, defaultValue, error }: { label: string; name: string; options: string[]; defaultValue?: string; error?: string }) {
  return (
    <fieldset className="flex flex-col gap-2.5">
      <legend className="pb-2.5 text-xs leading-4 font-semibold text-[#334155]">{label}</legend>
      <div className="flex flex-wrap gap-x-8 gap-y-2">
        {options.map((option) => (
          <label key={option} className="flex cursor-pointer items-center gap-2 text-sm leading-5 text-[#334155]">
            <input type="radio" name={name} value={option} defaultChecked={option === defaultValue} className="size-4 accent-navy" />
            {option}
          </label>
        ))}
      </div>
      {error && <p className="text-sm text-brand-red">{error}</p>}
    </fieldset>
  );
}

function PillGroup({ label, name, options }: { label: string; name: string; options: string[] }) {
  return (
    <fieldset className="flex flex-col gap-2.5">
      <legend className="pb-2.5 text-xs leading-4 font-semibold text-[#334155]">{label}</legend>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {options.map((option) => (
          <label key={option} className="cursor-pointer">
            <input type="radio" name={name} value={option} className="peer sr-only" />
            <span className="block rounded-lg border border-[#cbd5e1] bg-[#f8fafc] py-2.5 text-center text-sm text-[#334155] peer-checked:border-navy peer-checked:bg-navy peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-navy">
              {option}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
