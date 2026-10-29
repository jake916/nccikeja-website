import Image from "next/image";

import { cn } from "@/lib/cn";

// SVGs in /public/flags come from flag-icons (MIT), 4:3 aspect ratio.
const countries = {
  ng: "Nigeria",
  us: "United States",
  gb: "United Kingdom",
  eu: "European Union",
  ca: "Canada",
} as const;

export type FlagCode = keyof typeof countries;

export function Flag({ code, size = "md", className }: { code: FlagCode; size?: "sm" | "md"; className?: string }) {
  const [width, height] = size === "sm" ? [16, 12] : [24, 18];
  return (
    <Image
      src={`/flags/${code}.svg`}
      alt={countries[code]}
      width={width}
      height={height}
      className={cn("rounded-[2px] ring-1 ring-black/10", className)}
    />
  );
}
