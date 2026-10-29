"use client";

import { useFormStatus } from "react-dom";

import { buttonClasses, type ButtonStyleProps } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export function SubmitButton({ children, pendingLabel = "Sending…", className, ...style }: ButtonStyleProps & {
  children: React.ReactNode;
  pendingLabel?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={cn(buttonClasses(style), "disabled:cursor-wait disabled:opacity-70", className)}>
      {pending ? pendingLabel : children}
    </button>
  );
}
