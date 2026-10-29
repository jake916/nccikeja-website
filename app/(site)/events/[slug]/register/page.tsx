import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { CmsImage } from "@/components/ui/cms-image";
import { Container } from "@/components/ui/container";
import { getEvent, getEvents } from "@/lib/content";
import { categoryLabels } from "@/lib/events";
import { formatFullDate } from "@/lib/format";

import { RegisterForm } from "./register-form";

export async function generateStaticParams() {
  return (await getEvents()).filter((e) => e.registrationOpen).map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: PageProps<"/events/[slug]/register">): Promise<Metadata> {
  const event = await getEvent((await params).slug);
  return event ? { title: `Register: ${event.title}` } : {};
}

export default async function RegisterPage({ params }: PageProps<"/events/[slug]/register">) {
  const event = await getEvent((await params).slug);
  if (!event || !event.registrationOpen) notFound();

  return (
    <div className="pb-24">
      <section className="relative flex min-h-[520px] items-center justify-center overflow-hidden bg-ink px-6 pt-20 pb-36 lg:h-[600px] lg:pt-40 lg:pb-[166px]">
        <CmsImage image={event.image} alt="" sizes="100vw" preload />
        <div className="absolute inset-0 bg-linear-to-b from-ink/80 via-ink/0 to-surface-bright" />
        <div className="relative flex max-w-[800px] flex-col items-center gap-4 text-center">
          <span className="rounded-full bg-brand-red px-3 py-1 text-sm leading-5 font-medium text-white uppercase">
            {event.label ?? (event.category ? categoryLabels[event.category] : "Event")}
          </span>
          <h1 className="text-[36px] leading-[44px] font-bold text-white sm:text-5xl sm:leading-[56px]">{event.title}</h1>
          {event.summary && <p className="text-lg leading-7 text-white/90">{event.summary}</p>}
        </div>
      </section>

      <Container className="relative -mt-24 lg:px-[120px]">
        <div className="grid gap-6 lg:grid-cols-[419px_1fr]">
          <section className="flex flex-col gap-12 self-start rounded-xl border border-outline/30 bg-white p-8 shadow-[0_8px_20px_rgb(21_26_75/0.08)] sm:p-12">
            <h2 className="text-2xl leading-8 font-semibold text-navy">Event Details</h2>
            <dl className="flex flex-col gap-12">
              <div className="flex gap-3">
                <Image src="/icons/events/date.svg" alt="" width={18} height={24} className="shrink-0" />
                <div>
                  <dt className="leading-4 font-semibold text-body">Date &amp; Time</dt>
                  <dd className="leading-6 text-muted">
                    {formatFullDate(event.startDate)}
                    {event.timeLabel && <br />}
                    {event.timeLabel}
                  </dd>
                </div>
              </div>
              {event.venue && (
                <div className="flex gap-3">
                  <Image src="/icons/events/venue.svg" alt="" width={16} height={24} className="shrink-0" />
                  <div>
                    <dt className="leading-4 font-semibold text-body">Location</dt>
                    <dd className="leading-6 text-muted">
                      {event.venue}
                      {event.address && <br />}
                      {event.address}
                    </dd>
                  </div>
                </div>
              )}
            </dl>
            {event.registrationNote && <p className="border-t border-outline/30 pt-12 leading-6 text-muted">{event.registrationNote}</p>}
          </section>

          <section className="flex flex-col gap-12 self-start rounded-xl border border-outline/30 bg-white p-8 shadow-[0_8px_20px_rgb(21_26_75/0.08)] sm:p-12">
            <div>
              <h2 className="text-2xl leading-8 font-semibold text-navy">Secure Your Seat</h2>
              <p className="pt-1 leading-6 text-muted">Please provide your details below to register.</p>
            </div>
            <RegisterForm eventSlug={event.slug} eventTitle={event.title} />
          </section>
        </div>
      </Container>
    </div>
  );
}
