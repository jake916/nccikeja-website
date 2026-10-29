import type { Metadata } from "next";
import Image from "next/image";

import { HeaderBackdrop } from "@/components/layout/header-backdrop";
import { FellowshipChat } from "@/components/online/fellowship-chat";
import { LivePlayer } from "@/components/online/live-player";
import { SermonNotes } from "@/components/online/sermon-notes";
import { ButtonLink } from "@/components/ui/button";
import { CmsImage } from "@/components/ui/cms-image";
import { Container } from "@/components/ui/container";
import { getOnlineChurchPage } from "@/lib/content";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Online Church",
  description: "Join our services live, chat with the church family and send a prayer request.",
};

export default async function OnlineChurchPage() {
  const page = await getOnlineChurchPage();

  return (
    <>
      <HeaderBackdrop />
      <Container className="pt-5 pb-16 lg:px-16">
        <div className="grid gap-6 lg:grid-cols-[752px_1fr]">
          <div className="flex flex-col gap-8">
            <LivePlayer
              streamUrl={page?.streamUrl ?? null}
              isLive={Boolean(page?.isLive)}
              title={page?.streamTitle ?? "Online Church"}
              subtitle={page?.streamSubtitle ?? null}
            >
              <CmsImage image={page?.poster} alt="" sizes="(min-width: 1024px) 752px, 100vw" preload />
            </LivePlayer>

            <div className="grid gap-6 md:grid-cols-2">
              <SermonNotes />

              {page?.keyScriptures && page.keyScriptures.length > 0 && (
                <section className="relative overflow-hidden rounded-xl bg-navy p-6 shadow-[0_1px_2px_rgb(0_0_0/0.05)]">
                  <Image src="/icons/online/scripture-watermark.svg" alt="" width={87} height={78} className="absolute top-0 right-0" />
                  <h2 className="relative flex items-center gap-3 pb-6 text-2xl leading-8 font-semibold text-white">
                    <Image src="/icons/online/scriptures.svg" alt="" width={22} height={19.5} />
                    Key Scriptures
                  </h2>
                  <ul className="relative flex flex-col gap-4">
                    {page.keyScriptures.map((s, i) => (
                      <li key={s._key} className={cn("flex flex-col gap-1 border-l pl-4", i === 0 ? "border-butter" : "border-outline/30")}>
                        <h3 className="leading-6 font-bold text-white">{s.reference}</h3>
                        {s.text && <p className="leading-6 text-white/80">&ldquo;{s.text}&rdquo;</p>}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <section className="flex flex-col gap-6 rounded-xl border border-outline/30 bg-linear-to-r from-surface-bright to-surface p-6 shadow-[0_1px_2px_rgb(0_0_0/0.05)] sm:flex-row sm:items-center sm:justify-between md:col-span-2">
                <div className="flex items-center gap-4">
                  <Image src="/icons/online/new-here.svg" alt="" width={44.81} height={48} className="shrink-0" />
                  <div className="flex flex-col gap-1">
                    <h2 className="text-2xl leading-8 font-semibold text-ink">New Here?</h2>
                    <p className="leading-6 text-muted">We&apos;d love to connect with you and send you a welcome gift.</p>
                  </div>
                </div>
                <ButtonLink href="/connect" variant="ink" shape="rounded" size="md" className="self-start py-3 leading-4 font-semibold sm:self-center">
                  Connect With Us
                </ButtonLink>
              </section>
            </div>
          </div>

          <FellowshipChat />
        </div>
      </Container>
    </>
  );
}
