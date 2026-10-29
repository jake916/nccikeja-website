import type { Metadata } from "next";
import Image from "next/image";

import { CmsImage } from "@/components/ui/cms-image";
import { getOnlineChurchPage } from "@/lib/content";

import { PrayerForm } from "./prayer-form";

export const metadata: Metadata = {
  title: "Prayer Request",
  description: "Send a prayer request. Our intercessory team will stand in faith with you.",
};

export default async function PrayerPage() {
  const page = await getOnlineChurchPage();

  return (
    <>
      <section className="relative mt-20 flex min-h-[420px] items-center justify-center overflow-hidden bg-ink px-6 pb-20 lg:h-[512px] lg:pb-12">
        <CmsImage image={page?.prayerImage} alt="" sizes="100vw" preload />
        <div className="absolute inset-0 bg-ink/70" />
        <div className="relative flex max-w-[667px] flex-col items-center gap-3 px-6 text-center">
          <span className="rounded bg-gold/20 px-3 py-1 text-sm leading-5 font-medium tracking-[0.05em] text-butter uppercase">Prayer Request</span>
          <h1 className="pt-3 text-[36px] leading-[44px] font-bold tracking-[-0.02em] text-white sm:text-5xl sm:leading-[56px]">
            {page?.prayerHeading ?? "Let Us Pray With You"}
          </h1>
          {page?.prayerText && <p className="text-lg leading-7 text-white/90">{page.prayerText}</p>}
        </div>
      </section>

      <section className="bg-surface px-4 pb-24">
        <div className="relative mx-auto -mt-12 flex max-w-[768px] flex-col gap-12">
          <div className="flex flex-col gap-12 rounded-lg border border-outline/20 bg-surface-bright p-6 shadow-[0_8px_20px_rgb(21_26_75/0.08)] sm:p-12">
            <div className="flex flex-col items-center gap-1 text-center">
              <Image src="/icons/online/prayer-hands.svg" alt="" width={42} height={41} />
              <h2 className="pt-2 text-2xl leading-8 font-semibold text-ink">Submit Your Prayer</h2>
              <p className="leading-6 text-muted">
                Your requests are kept confidential and are lifted up daily by our dedicated prayer team.
                <br className="hidden sm:block" /> You don&apos;t have to carry it alone.
              </p>
            </div>
            <PrayerForm categories={page?.prayerCategories ?? []} />
          </div>

          <div className="flex flex-col items-center gap-3 text-center">
            <span aria-hidden className="h-1 w-12 rounded bg-brand-red" />
            <p className="max-w-[488px] text-sm leading-5 font-medium tracking-[0.01em] text-muted">
              Our pastoral care team reviews submissions daily. If you requested a follow-up, someone will reach out to you within 48 hours.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
