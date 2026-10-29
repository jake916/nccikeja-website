import Link from "next/link";

import { cn } from "@/lib/cn";

const variants = {
  red: "bg-brand-red text-white shadow-[0_10px_15px_-3px_rgb(188_1_0/0.2),0_4px_6px_-4px_rgb(188_1_0/0.2)] hover:bg-brand-red/90",
  gold: "bg-gold text-white shadow-[0_10px_15px_-3px_rgb(204_168_48/0.2),0_4px_6px_-4px_rgb(204_168_48/0.2)] hover:bg-gold/90",
  navy: "bg-navy text-white shadow-[0_10px_15px_-3px_rgb(21_26_75/0.2),0_4px_6px_-4px_rgb(21_26_75/0.2)] hover:bg-navy/90",
  ink: "bg-ink text-white shadow-[0_2px_4px_rgb(0_0_0/0.1),0_4px_6px_rgb(0_0_0/0.1)] hover:bg-navy",
  "outline-gold": "border-2 border-gold bg-black/20 text-gold backdrop-blur-[2px] hover:bg-black/30",
  "outline-red": "border border-brand-red text-brand-red hover:bg-brand-red/5",
  "outline-navy": "border-2 border-navy text-navy hover:bg-navy/5",
  "outline-light": "border border-white/30 text-white hover:bg-white/10",
} as const;

const shapes = { pill: "rounded-full", rounded: "rounded-lg", square: "rounded" } as const;

const sizes = {
  sm: "px-6 py-1.5 text-base font-medium",
  compact: "px-8 py-3.5 text-sm font-medium",
  md: "px-6 py-3 text-base font-bold",
  form: "px-6 py-4 text-base font-semibold",
  lg: "px-8 py-4 text-base font-semibold",
} as const;

export type ButtonStyleProps = {
  variant?: keyof typeof variants;
  shape?: keyof typeof shapes;
  size?: keyof typeof sizes;
};

export function buttonClasses({ variant = "red", shape = "pill", size = "lg" }: ButtonStyleProps = {}) {
  return cn(
    "inline-flex items-center justify-center gap-2 leading-4 tracking-[0.02em] whitespace-nowrap transition-colors",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
    variants[variant],
    shapes[shape],
    sizes[size],
  );
}

export function ButtonLink({
  variant,
  shape,
  size,
  className,
  ...props
}: React.ComponentProps<typeof Link> & ButtonStyleProps) {
  return <Link className={cn(buttonClasses({ variant, shape, size }), className)} {...props} />;
}
