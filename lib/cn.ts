import { twMerge } from "tailwind-merge";

/** Joins class names, skipping falsy values; later Tailwind classes override conflicting earlier ones. */
export function cn(...classes: (string | false | null | undefined)[]) {
  return twMerge(classes.filter(Boolean).join(" "));
}
