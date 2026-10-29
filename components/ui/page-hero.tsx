import { cn } from "@/lib/cn";
import type { SanityImage } from "@/sanity/lib/image";

import { CmsImage } from "./cms-image";
import { Container } from "./container";

const variants = {
  /** Give page: tall banner, flat navy tint, compact title */
  banner: {
    section: "min-h-[520px] lg:min-h-[682px]",
    overlay: "bg-navy/80",
    title: "text-[32px] leading-10 tracking-[-0.01em]",
  },
  /** Who we are, Academy, Publications: gradient tint, large title */
  feature: {
    section: "min-h-[480px] lg:h-[600px]",
    overlay: "bg-linear-to-b from-ink/50 to-navy/80",
    title: "text-[36px] leading-[44px] tracking-[-0.02em] sm:text-5xl sm:leading-[56px]",
  },
} as const;

/** Full-width image banner under the overlay header, used at the top of inner pages. */
export function PageHero({
  title,
  description,
  image,
  variant = "banner",
  eyebrow,
  children,
}: {
  title: string;
  description?: React.ReactNode;
  image?: SanityImage | null;
  variant?: keyof typeof variants;
  eyebrow?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const styles = variants[variant];

  return (
    <section className={cn("relative flex items-center overflow-hidden bg-navy pt-20", styles.section)}>
      <CmsImage image={image} alt="" sizes="100vw" preload />
      <div className={cn("absolute inset-0", styles.overlay)} />
      <Container className="relative py-16">
        <div className="mx-auto flex max-w-[896px] flex-col items-center gap-6 text-center text-white">
          {eyebrow}
          <h1 className={cn("font-bold drop-shadow-[0_4px_3px_rgb(0_0_0/0.1)]", styles.title)}>{title}</h1>
          {description && <div className="max-w-[672px] text-lg leading-7 text-white/90">{description}</div>}
          {children}
        </div>
      </Container>
    </section>
  );
}
