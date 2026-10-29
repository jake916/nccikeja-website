import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { RichText } from "@/components/publications/rich-text";
import { CmsImage } from "@/components/ui/cms-image";
import { Container } from "@/components/ui/container";
import { getEvent, getEventSlugs } from "@/lib/content";
import { formatDayTime } from "@/lib/format";
import { categoryLabels } from "@/lib/events";

export async function generateStaticParams() {
  return (await getEventSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/events/[slug]">): Promise<Metadata> {
  const event = await getEvent((await params).slug);
  return event ? { title: event.title, description: event.summary ?? undefined } : {};
}

export default async function EventPage({ params }: PageProps<"/events/[slug]">) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) notFound();

  return (
    <>
      <section className="relative flex min-h-[520px] items-end overflow-hidden bg-ink pt-20 pb-16 lg:h-[716px] lg:pb-24">
        <CmsImage image={event.image} alt="" sizes="100vw" preload />
        <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/60 to-ink/0" />
        <Container className="relative lg:px-[120px]">
          <span className="rounded bg-gold px-3 py-1 text-sm leading-5 font-medium text-[#4f3e00]">
            {event.label ?? (event.category ? categoryLabels[event.category] : "Event")}
          </span>
          <h1 className="max-w-[768px] pt-5 text-[36px] leading-[44px] font-bold text-white sm:text-5xl sm:leading-[60px]">{event.title}</h1>
          <p className="flex items-center gap-1 pt-3 text-lg leading-7 text-white/90">
            <Image src="/icons/events/calendar-hero.svg" alt="" width={18} height={20} className="mr-1" />
            {formatDayTime(event.startDate, event.startTime)}
          </p>
        </Container>
      </section>

      <section className="bg-surface-bright py-16 lg:py-24">
        <Container className="grid gap-12 lg:grid-cols-[729px_273px] lg:justify-between lg:px-20">
          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-6">
              <h2 className="text-2xl leading-8 font-semibold text-ink">About the Event</h2>
              {event.body ? <RichText value={event.body} /> : event.summary && <p className="text-lg leading-7 text-body">{event.summary}</p>}
            </div>
            {event.galleryImage && (
              <div className="relative h-64 overflow-hidden rounded-xl border border-outline bg-white shadow-[0_1px_2px_rgb(0_0_0/0.05)]">
                <CmsImage image={event.galleryImage} alt="" sizes="(min-width: 1024px) 729px, 100vw" />
              </div>
            )}
          </div>

          <aside className="self-start rounded-xl border border-outline bg-surface p-8 shadow-[0_8px_20px_rgb(21_26_75/0.04)] lg:sticky lg:top-28">
            <h2 className="mb-8 border-b border-outline/30 pb-4 text-2xl leading-8 font-semibold text-ink">Event Details</h2>
            <dl className="flex flex-col gap-6 pb-8">
              {event.venue && (
                <div className="flex gap-4">
                  <Image src="/icons/events/location.svg" alt="" width={40} height={44} className="shrink-0" />
                  <div>
                    <dt className="text-sm leading-5 font-medium text-muted uppercase">Location</dt>
                    <dd className="leading-6 font-medium text-ink">{event.venue}</dd>
                    {event.address && <dd className="text-sm leading-5 text-muted">{event.address}</dd>}
                  </div>
                </div>
              )}
              {event.speaker && (
                <div className="flex gap-4">
                  <Image src="/icons/events/speaker.svg" alt="" width={40} height={40} className="shrink-0" />
                  <div>
                    <dt className="text-sm leading-5 font-medium text-muted uppercase">Speaker</dt>
                    <dd className="leading-6 font-medium text-ink">{event.speaker}</dd>
                  </div>
                </div>
              )}
            </dl>
            <div className="flex flex-col gap-4">
              {event.registrationOpen && (
                <Link href={`/events/${event.slug}/register`} className="flex items-center justify-center gap-2 rounded-lg bg-brand-red py-4 leading-4 font-semibold text-white hover:bg-brand-red/90">
                  <Image src="/icons/events/register.svg" alt="" width={20} height={16.4} />
                  Register for Event
                </Link>
              )}
              <a href={`/events/${event.slug}/calendar`} className="flex items-center justify-center gap-2 rounded-lg bg-ink py-4 leading-4 font-semibold text-white hover:bg-navy">
                <Image src="/icons/events/calendar-add.svg" alt="" width={18} height={20} />
                Add to Calendar
              </a>
            </div>
          </aside>
        </Container>
      </section>

      {event.related && event.related.length > 0 && (
        <section className="bg-surface-container py-16 lg:py-24">
          <Container className="lg:px-[120px]">
            <div className="flex items-center justify-between pb-12">
              <h2 className="text-2xl leading-8 font-semibold text-ink">Related Events</h2>
              <Link href="/events/upcoming" className="flex items-center gap-1 leading-4 font-semibold text-brand-red hover:underline">
                View all
                <Image src="/icons/events/arrow-red.svg" alt="" width={9.333} height={9.333} />
              </Link>
            </div>
            <ul className="grid gap-8 md:grid-cols-3">
              {event.related.map((r) => (
                <li key={r._id}>
                  <Link href={`/events/${r.slug}`} className="group block h-full overflow-hidden rounded-xl border border-outline bg-white shadow-[0_1px_2px_rgb(0_0_0/0.05)]">
                    <div className="relative h-48 bg-[#e4e1e6]">
                      <CmsImage image={r.image} alt="" sizes="(min-width: 768px) 325px, 100vw" className="object-cover transition-transform duration-300 group-hover:scale-105" />
                    </div>
                    <div className="flex flex-col gap-2 p-6">
                      <p className="flex items-center gap-2 text-sm leading-5 text-muted">
                        <Image src="/icons/events/clock-sm.svg" alt="" width={11.667} height={11.667} />
                        {formatDayTime(r.startDate, r.startTime, { short: true })}
                      </p>
                      <h3 className="text-lg leading-7 font-semibold text-ink">{r.title}</h3>
                      {r.summary && <p className="line-clamp-2 leading-6 text-muted">{r.summary}</p>}
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
