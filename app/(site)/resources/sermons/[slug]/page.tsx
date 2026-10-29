import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { HeaderBackdrop } from "@/components/layout/header-backdrop";
import { VideoPlayer } from "@/components/sermons/video-player";
import { CmsImage } from "@/components/ui/cms-image";
import { Container } from "@/components/ui/container";
import { ShareButton } from "@/components/ui/share-button";
import { getRecommendedSermons, getSermon, getSermonSlugs } from "@/lib/content";
import { formatLongDate, formatShortDate } from "@/lib/format";

export async function generateStaticParams() {
  return (await getSermonSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/resources/sermons/[slug]">): Promise<Metadata> {
  const sermon = await getSermon((await params).slug);
  return sermon ? { title: sermon.title, description: sermon.description ?? undefined } : {};
}

export default async function SermonPage({ params }: PageProps<"/resources/sermons/[slug]">) {
  const { slug } = await params;
  const [sermon, recommended] = await Promise.all([getSermon(slug), getRecommendedSermons(slug)]);
  if (!sermon) notFound();

  return (
    <>
      <HeaderBackdrop />
      <Container className="max-w-[1200px] px-4 pt-6 pb-12 sm:px-6 lg:px-20 lg:pt-[5px]">
        <div className="flex flex-col gap-8">
          <VideoPlayer videoUrl={sermon.videoUrl} title={sermon.title}>
            <CmsImage image={sermon.thumbnail} alt="" sizes="(min-width: 1200px) 1040px, 100vw" preload />
          </VideoPlayer>

          <div className="flex flex-col gap-4 border-b border-outline/30 pb-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex flex-col gap-2">
                <span className="self-start rounded-full bg-gold px-3 py-1 text-sm leading-5 font-medium tracking-[0.01em] text-[#4f3e00]">
                  {sermon.isLatest ? "Latest Series" : (sermon.series ?? "Sermon")}
                </span>
                <h1 className="pt-2 text-[36px] leading-[44px] font-bold tracking-[-0.02em] text-navy sm:text-5xl sm:leading-[56px]">
                  {sermon.title}
                </h1>
                <p className="flex flex-wrap items-center gap-2 text-lg leading-7 text-muted">
                  {sermon.speaker && (
                    <>
                      <Image src="/icons/sermons/user-md.svg" alt="" width={14} height={14} />
                      <span>{sermon.speaker} •</span>
                    </>
                  )}
                  <Image src="/icons/sermons/calendar-md.svg" alt="" width={15} height={17} />
                  <time dateTime={sermon.date}>{formatLongDate(sermon.date)}</time>
                </p>
              </div>
              <div id="listen" className="flex shrink-0 items-start gap-4">
                {sermon.audioUrl && (
                  <a
                    href={`${sermon.audioUrl}?dl=`}
                    className="flex items-center gap-2 border border-navy px-6 py-3 leading-4 font-semibold tracking-[0.02em] text-navy transition-colors hover:bg-navy/5"
                  >
                    <Image src="/icons/sermons/download.svg" alt="" width={16} height={16} />
                    Download Audio
                  </a>
                )}
                <ShareButton title={sermon.title} />
              </div>
            </div>
            {sermon.audioUrl && <audio controls preload="none" src={sermon.audioUrl} className="w-full" />}
            {sermon.description && <p className="pt-4 leading-6 text-body">{sermon.description}</p>}
          </div>
        </div>
      </Container>

      {recommended.length > 0 && (
        <section className="bg-surface py-12">
          <Container className="max-w-[1280px] lg:px-[120px]">
            <h2 className="pb-8 text-[32px] leading-10 font-bold tracking-[-0.01em] text-navy">Recommended Sermons</h2>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-[25px] lg:grid-cols-4">
              {recommended.map((item) => (
                <li key={item._id}>
                  <Link
                    href={`/resources/sermons/${item.slug}`}
                    className="group block overflow-hidden rounded-lg border border-outline/30 bg-white shadow-[0_4px_12px_rgb(21_26_75/0.03)]"
                  >
                    <div className="relative aspect-video bg-surface-dim">
                      <CmsImage image={item.thumbnail} alt="" sizes="(min-width: 1024px) 240px, 50vw" className="object-cover transition-transform duration-300 group-hover:scale-105" />
                      {item.duration && (
                        <span className="absolute right-2 bottom-2 bg-ink/80 px-2 py-1 text-sm leading-5 font-medium tracking-[0.01em] text-white backdrop-blur-sm">
                          {item.duration}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col gap-1 p-4">
                      <h3 className="truncate text-lg leading-7 font-bold text-body">{item.title}</h3>
                      <p className="text-sm leading-5 font-medium tracking-[0.01em] text-muted">
                        {[item.speaker, formatShortDate(item.date).replace(/ 0(\d),/, " $1,")].filter(Boolean).join(" • ")}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}
    </>
  );
}
