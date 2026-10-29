import { cn } from "@/lib/cn";

const titleSizes = {
  md: "text-[28px] leading-9 tracking-[-0.01em] lg:text-[32px] lg:leading-10",
  lg: "text-[34px] leading-[42px] tracking-[-0.02em] lg:text-5xl lg:leading-[56px]",
} as const;

export function SectionTitle({
  as: Tag = "h2",
  size = "md",
  className,
  children,
}: {
  as?: "h1" | "h2" | "h3";
  size?: keyof typeof titleSizes;
  className?: string;
  children: React.ReactNode;
}) {
  return <Tag className={cn("font-bold text-navy", titleSizes[size], className)}>{children}</Tag>;
}

/** Title + supporting paragraph, used at the top of most sections. */
export function SectionHeading({
  title,
  description,
  size,
  align = "left",
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  size?: keyof typeof titleSizes;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-4", align === "center" && "items-center text-center", className)}>
      <SectionTitle size={size}>{title}</SectionTitle>
      {description && <p className="max-w-[672px] text-lg leading-7 text-muted">{description}</p>}
    </div>
  );
}
