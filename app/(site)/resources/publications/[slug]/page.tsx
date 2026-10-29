import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { HeaderBackdrop } from "@/components/layout/header-backdrop";
import { RelatedPublicationCard } from "@/components/publications/publication-cards";
import { RichText } from "@/components/publications/rich-text";
import { CmsImage } from "@/components/ui/cms-image";
import { Container } from "@/components/ui/container";
import { BookmarkButton } from "@/components/ui/bookmark-button";
import { ShareButton } from "@/components/ui/share-button";
import { getPublication, getPublicationSlugs, getSiteSettings } from "@/lib/content";
import { formatLongDate } from "@/lib/format";
import { isReadable, kindLabels } from "@/lib/publications";
import type { PublicationDetail } from "@/sanity/lib/queries";

export async function generateStaticParams() {
  return (await getPublicationSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/resources/publications/[slug]">): Promise<Metadata> {
  const item = await getPublication((await params).slug);
  return item ? { title: item.title, description: item.subtitle ?? item.excerpt ?? undefined } : {};
}

export default async function PublicationPage({ params }: PageProps<"/resources/publications/[slug]">) {
  const [item, settings] = await Promise.all([getPublication((await params).slug), getSiteSettings()]);
  if (!item) notFound();
  return isReadable(item.kind) ? <ArticleReader item={item} /> : <LibraryItem item={item} email={settings?.email ?? null} />;
}

/** Books, e-books, study guides and audio series: cover + downloads on the left, synopsis on the right. */
function LibraryItem({ item, email }: { item: PublicationDetail; email: string | null }) {
  const year = item.publishedAt.slice(0, 4);
  // Until a file is uploaded, each format button emails the church to request it
  const fileLink = (file: PublicationDetail["pdf"], format: string) =>
    file ? `${file.url}?dl=` : email ? `mailto:${email}?subject=${encodeURIComponent(`${item.title} (${format})`)}` : null;
  const pdfHref = fileLink(item.pdf, "PDF");
  const epubHref = fileLink(item.epub, "EPUB");

  return (
    <>
      <HeaderBackdrop />
      <Container className="pt-11 pb-20 lg:px-16">
        <div className="grid gap-12 lg:grid-cols-[452px_1fr]">
          <div className="flex flex-col gap-6">
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg border border-[#e4e1e6] bg-[#e4e1e6] shadow-[0_4px_6px_rgb(0_0_0/0.1),0_10px_15px_rgb(0_0_0/0.1)]">
              <CmsImage image={item.coverImage ?? item.image} alt={`${item.title} cover`} sizes="(min-width: 1024px) 452px, 100vw" preload />
            </div>
            {item.kind === "audioSeries" ? (
              item.audioUrl && (
                <div className="flex flex-col gap-3 rounded-lg border border-[#e4e1e6] bg-surface p-6">
                  <h2 className="text-2xl leading-8 font-semibold text-ink">Listen</h2>
                  <audio controls preload="none" src={item.audioUrl} className="w-full" />
                </div>
              )
            ) : (
              (pdfHref || epubHref) && (
                <div className="flex flex-col gap-3 rounded-lg border border-[#e4e1e6] bg-surface p-6">
                  <h2 className="text-2xl leading-8 font-semibold text-ink">Download Options</h2>
                  <p className="pb-2 leading-6 text-muted">Available formats for your device.</p>
                  {pdfHref && <DownloadLink href={pdfHref} label="Download PDF" icon={{ src: "/icons/publications/pdf.svg", width: 20, height: 20 }} solid />}
                  {epubHref && <DownloadLink href={epubHref} label="Download EPUB" icon={{ src: "/icons/publications/epub.svg", width: 22, height: 16 }} />}
                </div>
              )
            )}
          </div>

          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-3 border-b border-[#e4e1e6] pb-6">
              <div className="flex flex-wrap items-center gap-2 pb-2">
                <span className="rounded-full bg-gold px-3 py-1 text-sm leading-5 font-medium tracking-[0.025em] text-[#4f3e00] uppercase">
                  {item.featured ? "Featured Resource" : kindLabels[item.kind]}
                </span>
                <span className="flex items-center gap-1 text-sm leading-5 font-medium tracking-[0.01em] text-muted">
                  <Image src="/icons/publications/calendar.svg" alt="" width={10.5} height={11.667} />
                  Released {year}
                </span>
              </div>
              <h1 className="text-[36px] leading-[44px] font-bold tracking-[-0.02em] text-ink sm:text-5xl sm:leading-[56px]">{item.title}</h1>
              {item.subtitle && <p className="text-xl leading-8 text-muted sm:text-2xl">{item.subtitle}</p>}
              {item.author?.name && (
                <div className="flex items-center gap-2 pt-4">
                  <span className="relative size-10 overflow-hidden rounded-full bg-[#e4e1e6]">
                    <CmsImage image={item.author.photo} alt="" sizes="40px" />
                  </span>
                  <span>
                    <span className="block text-xs leading-4 font-medium tracking-[0.05em] text-muted uppercase">Author</span>
                    <span className="block leading-6 font-medium text-ink">{item.author.name}</span>
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4">
              {item.body ? <RichText value={item.body} /> : item.excerpt && <p className="text-lg leading-7 text-body">{item.excerpt}</p>}
              {item.keyThemes && item.keyThemes.length > 0 && (
                <>
                  <h2 className="pt-4 text-2xl leading-8 font-semibold text-ink">Key Themes Covered:</h2>
                  <ul className="flex flex-col gap-3">
                    {item.keyThemes.map((theme) => (
                      <li key={theme} className="flex gap-3 text-lg leading-7 font-bold text-body">
                        <Image src="/icons/publications/check.svg" alt="" width={20} height={24} className="shrink-0" />
                        {theme}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>
      </Container>

      {item.related && item.related.length > 0 && (
        <section className="border-t border-[#e4e1e6] bg-surface py-20">
          <Container className="lg:px-16">
            <div className="flex flex-col gap-4 pb-12 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col gap-2">
                <h2 className="text-[32px] leading-10 font-bold tracking-[-0.01em] text-ink">Related Resources</h2>
                <p className="text-lg leading-7 text-muted">Continue your journey with these recommended reads.</p>
              </div>
              <Link href="/resources/publications" className="flex items-center gap-2 leading-4 font-semibold tracking-[0.02em] text-brand-red hover:underline">
                View All Library
                <Image src="/icons/publications/arrow-right-red.svg" alt="" width={16} height={16} />
              </Link>
            </div>
            <ul className="grid gap-6 md:grid-cols-3">
              {item.related.map((related) => (
                <li key={related._id}>
                  <RelatedPublicationCard item={related} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}
    </>
  );
}

function DownloadLink({ href, label, icon, solid }: { href: string; label: string; icon: { src: string; width: number; height: number }; solid?: boolean }) {
  return (
    <a
      href={href}
      className={
        solid
          ? "flex items-center justify-between rounded bg-ink px-6 py-3 leading-4 font-semibold tracking-[0.02em] text-white hover:bg-navy"
          : "flex items-center justify-between rounded border-2 border-ink px-6 py-[10px] leading-4 font-semibold tracking-[0.02em] text-ink hover:bg-ink/5"
      }
    >
      <span className="flex items-center gap-2">
        <Image src={icon.src} alt="" width={icon.width} height={icon.height} />
        {label}
      </span>
      <Image src={solid ? "/icons/publications/download-light.svg" : "/icons/publications/download-dark.svg"} alt="" width={16} height={16} />
    </a>
  );
}

/** Articles and devotionals: full-width hero image and a centred reading column. */
function ArticleReader({ item }: { item: PublicationDetail }) {
  return (
    <article>
      <div className="relative mt-20 h-[320px] overflow-hidden bg-ink sm:h-[560px]">
        <CmsImage image={item.coverImage ?? item.image} alt="" sizes="100vw" preload />
        <div className="absolute inset-0 bg-ink/20" />
      </div>

      <div className="mx-auto flex max-w-[768px] flex-col gap-12 px-6 py-16 lg:py-[120px]">
        <header className="flex flex-col items-center gap-4 text-center">
          {item.category && (
            <span className="rounded-full bg-gold px-3 py-1 text-sm leading-5 font-medium tracking-[0.01em] text-[#4f3e00]">{item.category}</span>
          )}
          <h1 className="text-[36px] leading-[44px] font-bold tracking-[-0.02em] text-ink sm:text-5xl sm:leading-[56px]">{item.title}</h1>
          <p className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2 leading-6 text-muted">
            {item.author?.name && (
              <span className="flex items-center gap-2">
                <Image src="/icons/publications/user.svg" alt="" width={13.333} height={13.333} />
                {item.author.name}
              </span>
            )}
            <span className="flex items-center gap-2">
              <Image src="/icons/publications/calendar-md.svg" alt="" width={15} height={16.667} />
              <time dateTime={item.publishedAt}>{formatLongDate(item.publishedAt)}</time>
            </span>
            {item.readingTime && (
              <span className="flex items-center gap-2">
                <Image src="/icons/publications/clock.svg" alt="" width={16.667} height={16.667} />
                {item.readingTime} min read
              </span>
            )}
          </p>
        </header>

        <div className="flex flex-col gap-6 pb-8">
          {item.body ? <RichText value={item.body} /> : item.excerpt && <p className="text-xl leading-7 font-medium text-ink">{item.excerpt}</p>}
        </div>

        <footer className="flex items-center justify-between border-t border-outline pt-12">
          <span className="text-sm leading-5 font-medium tracking-[0.01em] text-muted">Share this article:</span>
          <span className="flex items-center gap-4">
            <ShareButton title={item.title} icon={{ src: "/icons/publications/share-btn.svg", width: 34, height: 42 }} />
            <BookmarkButton />
          </span>
        </footer>
      </div>
    </article>
  );
}
