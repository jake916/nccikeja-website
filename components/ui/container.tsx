import { cn } from "@/lib/cn";

/** Centres content at the design's 1200px max width with responsive side gutters. */
export function Container({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-10", className)}>{children}</div>;
}

const spacings = { none: "", default: "py-16 lg:py-24", lg: "py-16 lg:py-32" } as const;

/** Vertical rhythm shared by every content section (96px on desktop). */
export function Section({
  className,
  containerClassName,
  spacing = "default",
  children,
  ...props
}: React.ComponentProps<"section"> & { containerClassName?: string; spacing?: keyof typeof spacings }) {
  return (
    <section className={cn(spacings[spacing], className)} {...props}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
