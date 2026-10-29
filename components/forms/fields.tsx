import Image from "next/image";

import { cn } from "@/lib/cn";

import { SelectControl } from "./select-control";

/**
 * Field styles from the design:
 * - "square": Academy enrolment (square corners)
 * - "soft": prayer request (rounded, lighter border)
 * - "slate": Connect With Us (slate palette, compact)
 * - "gray": Share Your Testimony (neutral grey, soft shadow)
 */
export type FieldStyle = "square" | "soft" | "slate" | "gray";

const controls: Record<FieldStyle, string> = {
  square: "h-[50px] border border-outline bg-surface-bright px-4 text-base leading-6 text-body placeholder:text-muted/70",
  soft: "h-[50px] rounded border border-outline/50 bg-surface-bright px-3 text-base leading-6 text-body placeholder:text-[#6b7280]",
  slate: "h-11 rounded-lg border border-[#cbd5e1] bg-[#f8fafc] px-3.5 text-sm leading-5 text-[#1e293b] placeholder:text-[#94a3b8]",
  gray: "h-[46px] rounded-lg border border-[#d1d5db] bg-[#f9fafb] px-4 text-sm leading-5 text-[#1f2937] shadow-[0_1px_2px_rgb(0_0_0/0.05)] placeholder:text-[#6b7280]",
};

const labels: Record<FieldStyle, string> = {
  square: "text-sm leading-5 font-medium tracking-[0.01em] text-body",
  soft: "text-sm leading-5 font-medium tracking-[0.01em] text-ink",
  slate: "text-xs leading-4 font-semibold text-[#334155]",
  gray: "text-sm leading-5 font-medium text-[#374151]",
};

/** Select trigger text before a choice is made, matching each look's input placeholder. */
const placeholders: Record<FieldStyle, string> = {
  square: "text-muted/70",
  soft: "text-[#6b7280]",
  slate: "text-[#94a3b8]",
  gray: "text-[#6b7280]",
};

/** Dropdown card and option rows for the custom select. */
const menus: Record<FieldStyle, string> = {
  square: "w-full border-outline",
  soft: "w-full rounded border-outline/50",
  slate: "w-full rounded-lg border-[#cbd5e1]",
  gray: "w-full rounded-lg border-[#d1d5db]",
};

const menuOptions: Record<FieldStyle, string> = {
  square: "px-4 py-2.5 text-base leading-6 text-body",
  soft: "px-3 py-2.5 text-base leading-6 text-body",
  slate: "px-3.5 py-2 text-sm leading-5 text-[#1e293b]",
  gray: "px-4 py-2 text-sm leading-5 text-[#1f2937]",
};

const focus ="w-full focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15 aria-invalid:border-brand-red";

type FieldProps = {
  label: string;
  name: string;
  hint?: string;
  error?: string;
  className?: string;
  look?: FieldStyle;
  /** Small text or control shown at the end of the label row, e.g. "Same as phone" */
  aside?: React.ReactNode;
};

/** Label + hint + error wrapper shared by every input. */
function Field({ label, name, hint, error, className, look = "square", aside, children }: FieldProps & { children: React.ReactNode }) {
  return (
    <div className={cn("flex flex-col gap-1", look === "slate" && "gap-1.5", className)}>
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={name} className={labels[look]}>
          {label}
        </label>
        {aside}
      </div>
      {hint && <p className="text-xs leading-4 text-muted">{hint}</p>}
      {children}
      {error && (
        <p id={`${name}-error`} className="text-sm leading-5 text-brand-red">
          {error}
        </p>
      )}
    </div>
  );
}

function a11y(name: string, error?: string) {
  return { id: name, name, "aria-invalid": error ? true : undefined, "aria-describedby": error ? `${name}-error` : undefined };
}

export function TextField({
  type = "text",
  required,
  autoComplete,
  placeholder,
  icon,
  disabled,
  defaultValue,
  ...field
}: FieldProps & {
  type?: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
  icon?: { src: string; width: number; height: number };
  disabled?: boolean;
  defaultValue?: string;
}) {
  const look = field.look ?? "square";
  return (
    <Field {...field}>
      <div className="relative">
        {icon && <Image src={icon.src} alt="" width={icon.width} height={icon.height} className="pointer-events-none absolute top-0 left-0" />}
        <input
          type={type}
          required={required}
          autoComplete={autoComplete}
          placeholder={placeholder}
          disabled={disabled}
          defaultValue={defaultValue}
          className={cn(controls[look], focus, icon && "pl-10", "disabled:opacity-50")}
          {...a11y(field.name, field.error)}
        />
      </div>
    </Field>
  );
}

export function TextArea({
  required,
  placeholder,
  rows = 5,
  height = "min-h-[126px]",
  ...field
}: FieldProps & { required?: boolean; placeholder?: string; rows?: number; height?: string }) {
  const look = field.look ?? "square";
  return (
    <Field {...field}>
      <textarea
        required={required}
        placeholder={placeholder}
        rows={rows}
        className={cn(controls[look], focus, "h-auto resize-y py-3", height)}
        {...a11y(field.name, field.error)}
      />
    </Field>
  );
}

export function SelectField({
  options,
  placeholder,
  required,
  ...field
}: FieldProps & { options: (string | { value: string; label: string })[]; placeholder: string; required?: boolean }) {
  const look = field.look ?? "square";
  const chevron =
    look === "slate"
      ? { src: "/icons/connect/chevron.svg", width: 11, height: 7, className: "top-[19px] right-3.5" }
      : look === "gray"
        ? { src: "/icons/testimony/chevron.svg", width: 11, height: 7, className: "top-5 right-4" }
        : { src: "/icons/forms/chevron.svg", width: 44, height: 50, className: "top-0 right-0" };

  return (
    <Field {...field}>
      <SelectControl
        name={field.name}
        error={field.error}
        required={required}
        placeholder={placeholder}
        options={options.map((option) => (typeof option === "string" ? { value: option, label: option } : option))}
        className={cn(controls[look], focus)}
        placeholderClassName={placeholders[look]}
        menuClassName={menus[look]}
        optionClassName={menuOptions[look]}
        chevron={chevron}
      />
    </Field>
  );
}

/** Invisible to people; bots that fill it get silently ignored. */
export function Honeypot() {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label>
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}
