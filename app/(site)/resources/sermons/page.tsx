import type { Metadata } from "next";
import Image from "next/image";

import { SermonLibrary } from "@/components/sermons/sermon-library";
import { ButtonLink } from "@/components/ui/button";
import { CmsImage } from "@/components/ui/cms-image";
import { Container } from "@/components/ui/container";
import { CtaBanner } from "@/components/ui/cta-banner";
import { getListingPage, getSermons } from "@/lib/content";
import { formatLongDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Sermons",
  description: "Watch or listen to the latest teaching from New Covenant Church, Ikeja.",
};

export default async function SermonsPage() {
  const [page, sermons] = await Promise.all([getListingPage("sermonsPage"), getSermons()]);
  const latest = sermons[0];

  return (
    <>
      <section className="relative flex min-h-[560px] items-end overflow-hidden bg-ink pb-20 lg:h-[614px]">
        <div className="absolute inset-x-0 top-0 h-[611px]">
          <CmsImage image={page?.heroImage} alt="" sizes="100vw" preload />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="flex size-20 items-center justify-center rounded-full border border-white/30 bg-white/20 backdrop-blur-[6px]">
              <Image src="/icons/play.svg" alt="" width={16.5} height={21} />
            </span>
          </div>
          {latest?.duration && (
            <span className="absolute right-4 bottom-4 hidden items-center gap-2 rounded bg-black/60 px-3 py-1 text-sm leading-5 font-medium tracking-[0.01em] text-white backdrop-blur-md sm:flex">
              <Image src="/icons/sermons/play-sm.svg" alt="" width={12} height={12} />
              Watch Full Sermon ({latest.duration})
            </span>
          )}
        </div>
        <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/60 to-ink/0" />

        <Container className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:px-16">
          <div className="flex max-w-[776px] flex-col gap-2">
            <span className="self-start rounded-full bg-[#735c00] px-3 py-1 text-sm leading-5 font-medium tracking-[0.01em] text-white shadow-[0_1px_2px_rgb(0_0_0/0.05)]">
              Latest Release
            </span>
            <h1 className="pt-2 text-[40px] leading-[48px] font-bold tracking-[-0.02em] text-white sm:text-6xl sm:leading-[56px]">
              {page?.heroHeading ?? "Sermons"}
            </h1>
            {latest && (
              <>
                <p className="text-xl leading-8 font-semibold text-[#bec2fd] sm:text-[25px]">{latest.series ?? latest.title}</p>
                <div className="flex flex-wrap items-center gap-4 pt-2 text-sm leading-5 font-medium tracking-[0.01em] text-[#e4e1e6]">
                  {latest.speaker && (
                    <span className="flex items-center gap-1">
                      <Image src="/icons/sermons/user-light.svg" alt="" width={12} height={12} />
                      {latest.speaker}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Image src="/icons/sermons/calendar-light.svg" alt="" width={14} height={15} />
                    {formatLongDate(latest.date)}
                  </span>
                </div>
              </>
            )}
          </div>
          {latest && (
            <ButtonLink href={`/resources/sermons/${latest.slug}`} className="self-start shadow-[0_8px_20px_rgb(188_1_0/0.3)] lg:self-end">
              <Image src="/icons/sermons/play-circle.svg" alt="" width={20} height={20} />
              Watch Now
            </ButtonLink>
          )}
        </Container>
      </section>

      <section className="bg-surface-bright py-20">
        <Container className="lg:px-16">
          <SermonLibrary sermons={sermons.slice(1)} />
        </Container>
      </section>

      {page?.ctaHeading && <CtaBanner heading={page.ctaHeading} text={page.ctaText} />}
    </>
  );
}
