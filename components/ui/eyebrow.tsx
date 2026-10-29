import { cn } from "@/lib/cn";

/** Small gold-outlined pill that labels a section ("Ways to Connect", "Testimonies"). */
export function Eyebrow({
  tone = "dark",
  className,
  children,
}: {
  tone?: "dark" | "gold";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border border-gold px-4 py-1 text-sm leading-5 font-medium tracking-[0.01em]",
        tone === "gold" ? "text-gold" : "text-body",
        className,
      )}
    >
      {children}
    </span>
  );
}
