"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

import { buttonClasses } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const stepIcons = ["/icons/forms/step-mail.svg", "/icons/forms/step-chat.svg", "/icons/forms/step-calendar.svg"];

type DialogProps = {
  title?: string | null;
  message?: string | null;
  action?: { label: string; href: string };
  /**
   * "steps": large card with a next-steps list (Academy enrolment)
   * "status": compact card with a gold top edge (prayer, connect, event registration)
   * "simple": compact card with a full-width button (testimony)
   */
  variant?: "steps" | "status" | "simple";
  tone?: "success" | "error";
  nextSteps?: string[] | null;
  /** Called when the dialog closes without navigating, e.g. to retry after an error. */
  onClose?: () => void;
};

/** Confirmation shown over the blurred page after a form is sent. Uses a native modal <dialog>. */
export function SuccessDialog({
  title,
  message,
  action = { label: "Return to Homepage", href: "/" },
  variant = "steps",
  tone = "success",
  nextSteps,
  onClose,
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    ref.current?.showModal();
  }, []);

  const icon =
    variant === "steps"
      ? { src: "/icons/forms/success-badge.svg", width: 80, height: 112 }
      : variant === "simple"
        ? { src: "/icons/forms/testimony-badge.svg", width: 80, height: 104 }
        : { src: tone === "error" ? "/icons/forms/status-error.svg" : "/icons/forms/status-success.svg", width: 96, height: 144 };

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-labelledby={title ? "dialog-title" : undefined}
      aria-describedby="dialog-message"
      className={cn(
        "relative m-auto max-h-[calc(100dvh-32px)] w-[calc(100%-32px)] overflow-y-auto rounded-xl bg-white text-center",
        variant === "steps" && "max-w-[600px] border border-outline/30 p-8 shadow-[0_8px_20px_rgb(21_26_75/0.08)] backdrop:bg-ink/40 backdrop:backdrop-blur-md sm:p-12",
        variant === "status" && "max-w-[464px] border border-[#e4e1e6] px-8 pb-16 shadow-[0_8px_40px_rgb(21_26_75/0.12)] backdrop:bg-navy/80 backdrop:backdrop-blur-sm sm:px-10",
        variant === "simple" && "max-w-[500px] p-8 shadow-[0_4px_6px_rgb(0_0_0/0.1),0_10px_15px_rgb(0_0_0/0.1)] backdrop:bg-ink/40 backdrop:backdrop-blur-md sm:p-12",
      )}
    >
      {variant === "status" && <span aria-hidden className="absolute top-0 left-1/2 h-[3px] w-[171px] -translate-x-1/2 rounded-b-full bg-gold" />}

      <div className="flex flex-col items-center">
        <Image src={icon.src} alt="" width={icon.width} height={icon.height} className={variant === "status" ? "mt-20" : undefined} />
        {title && (
          <h2
            id="dialog-title"
            className={cn("pb-3 text-2xl leading-8", variant === "simple" ? "font-bold text-navy" : variant === "status" ? "font-semibold text-body" : "pb-4 font-semibold text-ink")}
          >
            {title}
          </h2>
        )}
        {message && (
          <p
            id="dialog-message"
            className={cn(
              "max-w-[480px] whitespace-pre-line text-muted",
              variant === "simple" ? "pb-12 leading-6" : "text-lg leading-7",
              variant === "status" && "pb-20",
              variant === "steps" && "pb-10",
            )}
          >
            {message}
          </p>
        )}

        {variant === "steps" && nextSteps && nextSteps.length > 0 && (
          <div className="mb-10 flex w-full flex-col gap-6 rounded-lg bg-surface-container p-6 text-left">
            <h3 className="text-sm leading-5 font-medium tracking-[0.05em] text-muted uppercase">Next Steps</h3>
            <ul className="flex flex-col gap-6">
              {nextSteps.map((step, i) => (
                <li key={step} className="flex gap-4">
                  <Image src={stepIcons[i % stepIcons.length]} alt="" width={32} height={36} className="shrink-0" />
                  <span className="leading-6 text-body">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-col items-center gap-3">
          <Link
            href={action.href}
            className={
              variant === "simple"
                ? "w-full min-w-[280px] rounded-lg bg-navy px-6 py-4 leading-6 text-white transition-colors hover:bg-ink sm:min-w-[404px]"
                : buttonClasses({ variant: "ink", shape: "rounded", size: "form" })
            }
          >
            {action.label}
          </Link>
          {tone === "error" && onClose && (
            <button type="button" onClick={() => ref.current?.close()} className="text-sm font-semibold text-navy underline">
              Try again
            </button>
          )}
        </div>
      </div>
    </dialog>
  );
}
