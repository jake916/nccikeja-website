import Image from "next/image";
import Link from "next/link";

import { CmsImage } from "@/components/ui/cms-image";
import { formatFileSize, kindLabels } from "@/lib/publications";
import type { PublicationSummary } from "@/sanity/lib/queries";

const href = (p: PublicationSummary) => `/resources/publications/${p.slug}`;
const card = "overflow-hidden rounded-xl border border-outline bg-white";
const redLink = "inline-flex items-center gap-1 font-semibold tracking-[0.02em] text-brand-red hover:underline";

/** Large bento card for the featured book: image left, details and two actions right. */
export function FeaturedPublicationCard({ item }: { item: PublicationSummary }) {
  return (
    <article className={`${card} flex flex-col sm:flex-row lg:h-[532px]`}>
      <div className="relative aspect-[379/530] bg-surface-container sm:aspect-auto sm:w-1/2">
        <CmsImage image={item.image} alt={item.title} sizes="(min-width: 1024px) 380px, 50vw" />
        <span className="absolute top-3 left-3 flex items-center gap-1 rounded bg-gold px-3 py-1 text-sm leading-5 font-medium tracking-[0.01em] text-[#4f3e00]">
          <Image src="/icons/publications/star.svg" alt="" width={13.333} height={12.667} />
          New Release
        </span>
      </div>
      <div className="flex flex-col justify-center p-8 sm:w-1/2 lg:p-12">
        <p className="pb-1 text-sm leading-5 font-medium tracking-[0.05em] text-body uppercase">{kindLabels[item.kind]}</p>
        <h3 className="pb-3 text-[32px] leading-10 font-bold tracking-[-0.01em] text-ink">{item.title}</h3>
        {item.excerpt && <p className="pb-6 leading-6 text-muted">{item.excerpt}</p>}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={item.purchaseUrl ?? href(item)}
            className="rounded bg-ink px-6 py-3 text-sm leading-4 font-semibold tracking-[0.02em] text-white transition-colors hover:bg-navy"
          >
            Get Copy
          </Link>
          <Link
            href={item.sampleUrl ?? href(item)}
            className="rounded border border-outline px-6 py-3 text-sm leading-4 font-semibold tracking-[0.02em] text-ink transition-colors hover:bg-surface"
          >
            Read Sample
          </Link>
        </div>
      </div>
    </article>
  );
}

const compactIcons = {
  studyGuide: { src: "/icons/publications/study-guide.svg", width: 16.5, height: 12 },
  default: { src: "/icons/publications/devotional.svg", width: 13.5, height: 13.5 },
};

/** Text-only bento card ("Daily Devotional", "Study Guide"). */
export function CompactPublicationCard({ item }: { item: PublicationSummary }) {
  const icon = item.kind === "studyGuide" ? compactIcons.studyGuide : compactIcons.default;

  return (
    <article className={`${card} flex h-full flex-col justify-between p-6`}>
      <div>
        <p className="flex items-center gap-1 pb-3 text-sm leading-5 font-medium tracking-[0.01em] text-ink">
          <Image src={icon.src} alt="" width={icon.width} height={icon.height} />
          {kindLabels[item.kind]}
        </p>
        <h3 className="pb-1 text-2xl leading-8 font-semibold text-body">
          <Link href={href(item)} className="hover:underline">
            {item.title}
          </Link>
        </h3>
        {item.excerpt && <p className="line-clamp-3 mb-6 leading-6 text-muted">{item.excerpt}</p>}
      </div>
      {item.kind === "studyGuide" && item.pdf ? (
        <div className="flex items-center justify-between">
          <span className="text-sm leading-5 font-medium tracking-[0.01em] text-subtle">PDF • {formatFileSize(item.pdf.size)}</span>
          <a href={`${item.pdf.url}?dl=`} className="flex items-center gap-1 text-sm leading-4 font-semibold tracking-[0.02em] text-ink hover:underline">
            <Image src="/icons/publications/download.svg" alt="" width={16} height={16} />
            Download
          </a>
        </div>
      ) : (
        <Link href={href(item)} className={`${redLink} leading-4`}>
          Read More
          <Image src="/icons/publications/arrow-right.svg" alt="" width={16} height={16} />
        </Link>
      )}
    </article>
  );
}

/** Horizontal card with image on the left, used for the rest of the library. */
export function WidePublicationCard({ item }: { item: PublicationSummary }) {
  const isArticle = item.kind === "article" || item.kind === "devotional";
  const meta = isArticle
    ? [item.category, item.readingTime && `${item.readingTime} min read`].filter(Boolean).join(" • ")
    : kindLabels[item.kind];

  return (
    <article className={`${card} flex min-h-[238px]`}>
      <div className="relative w-2/5 shrink-0 bg-surface-container">
        <CmsImage image={item.image} alt="" sizes="(min-width: 1024px) 225px, 40vw" />
      </div>
      <div className="flex flex-col justify-center p-6">
        <p className={isArticle ? "pb-1 text-sm leading-5 font-medium tracking-[0.01em] text-subtle" : "pb-1 text-sm leading-5 font-medium tracking-[0.05em] text-body uppercase"}>
          {meta}
        </p>
        <h3 className="line-clamp-2 mb-3 text-2xl leading-8 font-semibold text-body">
          <Link href={href(item)} className="hover:underline">
            {item.title}
          </Link>
        </h3>
        {item.excerpt && <p className="line-clamp-2 mb-6 leading-6 text-muted">{item.excerpt}</p>}
        {isArticle ? (
          <Link href={href(item)} className={`${redLink} text-sm leading-4`}>
            Read Article
          </Link>
        ) : (
          <Link
            href={href(item)}
            className="self-start rounded border border-ink px-3 py-1 text-sm leading-4 font-semibold tracking-[0.02em] text-ink transition-colors hover:bg-ink hover:text-white"
          >
            {item.kind === "audioSeries" ? "Listen Now" : `Get ${kindLabels[item.kind]}`}
          </Link>
        )}
      </div>
    </article>
  );
}

/** Card in the "Related Resources" row on a publication page. */
export function RelatedPublicationCard({ item }: { item: PublicationSummary }) {
  const action =
    item.kind === "audioSeries"
      ? { label: "Listen Now", icon: "/icons/publications/listen.svg", size: 11.667 }
      : item.pdf || item.kind === "studyGuide" || item.kind === "ebook"
        ? { label: "Download", icon: "/icons/publications/download-sm.svg", size: 9.333 }
        : { label: "Read", icon: "/icons/publications/arrow-right.svg", size: 12 };

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-[#e4e1e6] bg-surface-bright">
      <div className="relative aspect-[366/206] bg-[#e4e1e6]">
        <CmsImage image={item.image} alt="" sizes="(min-width: 1024px) 366px, 100vw" />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="pb-2 text-xs leading-4 font-bold tracking-[0.05em] text-[#735c00] uppercase">{kindLabels[item.kind]}</p>
        <h3 className="pb-2 text-2xl leading-8 font-semibold text-ink">{item.title}</h3>
        {item.excerpt && <p className="line-clamp-2 mb-4 leading-6 text-muted">{item.excerpt}</p>}
        <Link href={href(item)} className={`${redLink} mt-auto leading-4`}>
          {action.label}
          <Image src={action.icon} alt="" width={action.size} height={action.size} />
        </Link>
      </div>
    </article>
  );
}
