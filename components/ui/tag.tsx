import { cn } from "@/lib/cn";

/** Small butter-yellow label ("Our Vision", "Our Mandate"). */
export function Tag({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex rounded px-3 py-1 text-sm leading-5 font-medium tracking-[0.01em] bg-butter text-on-butter",
        className,
      )}
    >
      {children}
    </span>
  );
}
