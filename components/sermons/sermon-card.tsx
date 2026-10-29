import Image from "next/image";
import Link from "next/link";

import { CmsImage } from "@/components/ui/cms-image";
import { formatShortDate } from "@/lib/format";
import type { SermonSummary } from "@/sanity/lib/queries";

/** Library card: thumbnail, series badge, title, speaker/date and Watch/Audio actions. */
export function SermonCard({ sermon }: { sermon: SermonSummary }) {
  const href = `/resources/sermons/${sermon.slug}`;

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-surface-dim bg-white">
      <Link href={href} className="group relative block aspect-video bg-surface-dim" aria-label={`Watch ${sermon.title}`}>
        <CmsImage image={sermon.thumbnail} alt="" sizes="(min-width: 1024px) 350px, (min-width: 640px) 50vw, 100vw" />
        <span className="absolute inset-0 flex items-center justify-center bg-ink/20 opacity-0 transition-opacity group-hover:opacity-100">
          <Image src="/icons/play.svg" alt="" width={16.5} height={21} />
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-6">
        {sermon.series && (
          <span className="mb-2 self-start rounded bg-surface-container px-2 py-1 text-sm leading-5 font-medium tracking-[0.01em] text-muted">
            {sermon.series}
          </span>
        )}
        <h3 className="pb-2 text-2xl leading-8 font-semibold text-ink">
          <Link href={href} className="hover:underline">
            {sermon.title}
          </Link>
        </h3>
        <div className="mt-auto flex items-center justify-between gap-2 pb-4 text-sm leading-5 font-medium tracking-[0.01em] text-muted">
          {sermon.speaker && (
            <span className="flex items-center gap-1">
              <Image src="/icons/sermons/user.svg" alt="" width={11} height={11} />
              {sermon.speaker}
            </span>
          )}
          <time dateTime={sermon.date}>{formatShortDate(sermon.date)}</time>
        </div>
        <div className="flex items-center justify-center gap-3 border-t border-surface-dim pt-4">
          <Link href={href} className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2 leading-4 font-semibold tracking-[0.02em] text-brand-red hover:bg-brand-red/5">
            <Image src="/icons/sermons/watch.svg" alt="" width={20} height={16} />
            Watch
          </Link>
          <Link href={`${href}#listen`} className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2 leading-4 font-semibold tracking-[0.02em] text-ink hover:bg-ink/5">
            <Image src="/icons/sermons/audio.svg" alt="" width={18} height={18} />
            Audio
          </Link>
        </div>
      </div>
    </article>
  );
}
