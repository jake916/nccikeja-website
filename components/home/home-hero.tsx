import Image from "next/image";

import { ButtonLink } from "@/components/ui/button";
import { CmsImage } from "@/components/ui/cms-image";
import { Container } from "@/components/ui/container";
import { Slideshow } from "@/components/ui/slideshow";
import type { SanityImage } from "@/sanity/lib/image";

export function HomeHero({
  heading,
  subheading,
  images,
}: {
  heading: string | null;
  subheading: string | null;
  images: (SanityImage & { _key: string })[];
}) {
  return (
    <section className="relative flex min-h-[600px] items-center overflow-hidden bg-navy pt-20 lg:h-[800px] lg:pt-0">
      <Slideshow>
        {images.map((image, i) => (
          <CmsImage key={image._key} image={image} alt="" sizes="100vw" preload={i === 0} />
        ))}
      </Slideshow>
      <div className="absolute inset-0 bg-linear-to-b from-black/30 to-navy/60" />

      <Container className="relative py-16">
        <div className="mx-auto flex max-w-[794px] flex-col items-center gap-6 text-center text-white">
          {heading && (
            <h1 className="text-[40px] leading-[48px] font-bold tracking-[-0.02em] drop-shadow-[0_4px_3px_rgb(0_0_0/0.1)] sm:text-6xl sm:leading-[56px]">
              {heading}
            </h1>
          )}
          {subheading && (
            <p className="text-lg leading-7 font-semibold text-white/90 drop-shadow-[0_2px_2px_rgb(0_0_0/0.06)] sm:text-[25px]">
              {subheading}
            </p>
          )}
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <ButtonLink href="/online-church">
              <Image src="/icons/live.svg" alt="" width={20} height={20} />
              Watch Live
            </ButtonLink>
            <ButtonLink href="/who-we-are#visit" variant="outline-gold">
              Plan your Visit
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
