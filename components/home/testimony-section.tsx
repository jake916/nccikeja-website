import Image from "next/image";
import Link from "next/link";

import { ButtonLink } from "@/components/ui/button";
import { CmsImage } from "@/components/ui/cms-image";
import { Section } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionTitle } from "@/components/ui/section-heading";
import type { SanityImage } from "@/sanity/lib/image";

export function TestimonySection({ image, videoUrl }: { image: SanityImage | null; videoUrl: string | null }) {
  return (
    <Section className="bg-surface-bright" containerClassName="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
      <Link
        href={videoUrl ?? "/testimony"}
        aria-label="Watch a testimony"
        className="relative block h-[320px] overflow-hidden rounded-xl border-2 border-gold bg-navy shadow-card sm:h-[400px]"
      >
        <CmsImage image={image} alt="" sizes="(min-width: 1024px) 568px, 100vw" />
      </Link>

      <div className="flex flex-col items-start">
        <Eyebrow className="mb-6">Testimonies</Eyebrow>
        <SectionTitle size="lg" className="mb-6">
          Your Story Of His Faithfulness
        </SectionTitle>
        <p className="mb-10 text-lg leading-7 text-muted">
          Every testimony is proof that God is still at work. Whether it&apos;s a breakthrough, an answered prayer or a
          life made new, we want to hear it and celebrate it with you.
        </p>
        <ButtonLink href="/testimony" variant="gold" shape="rounded">
          Share your Testimony
          <Image src="/icons/share.svg" alt="" width={16} height={16} />
        </ButtonLink>
      </div>
    </Section>
  );
}
