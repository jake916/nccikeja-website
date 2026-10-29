import Image from "next/image";
import Link from "next/link";

import { CmsImage } from "@/components/ui/cms-image";
import { Section } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionHeading } from "@/components/ui/section-heading";
import type { SanityImage } from "@/sanity/lib/image";

const card = "flex flex-col justify-between gap-8 rounded-xl p-8 text-white shadow-card-sm transition-transform hover:-translate-y-1";

export function ConnectSection({ inPersonImage }: { inPersonImage: SanityImage | null }) {
  return (
    <Section className="bg-surface-bright" containerClassName="flex flex-col items-center gap-4">
      <Eyebrow>Ways to Connect</Eyebrow>
      <SectionHeading
        size="lg"
        align="center"
        className="pt-2"
        title="Find The Right Experience For You!"
        description="However you choose to join us, in person or online, become part of what God is doing in Ikeja."
      />

      <div className="grid w-full gap-6 pt-8 md:grid-cols-2 lg:grid-cols-12">
        <Link
          href="/who-we-are#visit"
          className="flex min-h-[390px] overflow-hidden rounded-xl border border-outline/20 bg-surface shadow-card transition-transform hover:-translate-y-1 md:col-span-2 lg:col-span-6"
        >
          <div className="flex flex-1 flex-col justify-between gap-8 p-8">
            <div className="flex flex-col gap-4">
              <h3 className="text-2xl leading-8 font-semibold text-navy">In Person</h3>
              <p className="max-w-[220px] leading-6 text-muted">Join us at Ikeja for worship, the Word and real community.</p>
            </div>
            <span className="inline-flex items-center gap-2 self-start border-b border-navy/30 pb-1 leading-4 font-semibold tracking-[0.02em] text-navy">
              Find Our Location
              <Image src="/icons/arrow-right-sm.svg" alt="" width={2.917} height={5.833} />
            </span>
          </div>
          <div className="relative flex-1">
            <CmsImage
              image={inPersonImage}
              alt=""
              sizes="(min-width: 1024px) 300px, 50vw"
              className="object-cover opacity-50 grayscale"
            />
          </div>
        </Link>

        <Link href="/online-church" className={`${card} bg-navy lg:col-span-3`}>
          <div className="flex flex-col gap-4">
            <h3 className="text-2xl leading-8 font-semibold">Watch Online</h3>
            <p className="leading-6 text-white/80">
              Can&apos;t be there in person? Join our services live or catch up anytime, wherever you are.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 self-start rounded-full border border-white/30 px-4 py-2 leading-4 font-semibold tracking-[0.02em]">
            Watch Now
            <Image src="/icons/live.svg" alt="" width={20} height={20} />
          </span>
        </Link>

        <Link href="/resources/academy" className={`${card} bg-linear-[125.8deg] from-navy to-gold lg:col-span-3`}>
          <div className="flex flex-col gap-4">
            <h3 className="text-2xl leading-8 font-semibold">Become a Member</h3>
            <p className="leading-6 text-white/90">
              Take the next step. Start with our Foundation &amp; Membership course and join the family.
            </p>
          </div>
          <span className="self-start border-b border-white/50 pb-1 leading-4 font-semibold tracking-[0.02em]">
            Join Today
          </span>
        </Link>
      </div>
    </Section>
  );
}
