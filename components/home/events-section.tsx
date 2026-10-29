import Link from "next/link";

import { ButtonLink } from "@/components/ui/button";
import { CmsImage } from "@/components/ui/cms-image";
import { Section } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { formatEventDate } from "@/lib/format";
import type { EventSummary } from "@/sanity/lib/queries";

export function EventsSection({ events }: { events: EventSummary[] }) {
  return (
    <Section className="bg-surface" containerClassName="flex flex-col gap-12">
      <SectionHeading title="Upcoming Events" description="Don't miss what God is doing in our midst." />

      {events.length > 0 ? (
        <ul className="grid gap-8 md:grid-cols-2">
          {events.map((event) => (
            <li key={event._id}>
              <Link
                href={event.slug ? `/events/${event.slug}` : "/events"}
                className="group relative flex h-[320px] flex-col justify-end overflow-hidden rounded-xl bg-navy p-8"
              >
                <CmsImage
                  image={event.image}
                  alt=""
                  sizes="(min-width: 768px) 584px, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-navy/80 mix-blend-multiply" />
                <div className="relative flex flex-col gap-2">
                  <time dateTime={event.startDate} className="leading-6 text-gold">
                    {formatEventDate(event.startDate, event.endDate)}
                  </time>
                  <h3 className="text-2xl leading-8 font-semibold text-white">{event.title}</h3>
                  {event.summary && <p className="line-clamp-2 leading-6 text-white/80">{event.summary}</p>}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-xl border border-outline/30 bg-white p-8 text-center text-muted">
          New events are on the way. Check back soon!
        </p>
      )}

      <ButtonLink href="/events" variant="navy" shape="rounded" className="mx-auto min-w-60">
        View all Events
      </ButtonLink>
    </Section>
  );
}
