"use client";

import Image from "next/image";
import { useState } from "react";

import { toYouTubeEmbed } from "@/lib/youtube";

/**
 * Service video card. While the service is live, the YouTube stream is embedded straight away;
 * otherwise the poster and title show until play is pressed.
 */
export function LivePlayer({
  streamUrl,
  isLive,
  title,
  subtitle,
  children,
}: {
  streamUrl: string | null;
  isLive: boolean;
  title: string | null;
  subtitle: string | null;
  children: React.ReactNode;
}) {
  const [playing, setPlaying] = useState(false);
  const showStream = Boolean(streamUrl) && (isLive || playing);
  // A live stream loads with YouTube's own play button; our play button (when not live) starts it immediately
  const embed = streamUrl ? toYouTubeEmbed(streamUrl, { autoplay: playing }) : null;

  return (
    <div className="relative aspect-video overflow-hidden rounded-xl bg-navy shadow-[0_4px_6px_rgb(0_0_0/0.1),0_10px_15px_rgb(0_0_0/0.1)]">
      {showStream && embed ? (
        <iframe
          src={embed}
          title={title ?? "Live service"}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 size-full"
        />
      ) : (
        <>
          {children}
          <div className="absolute inset-0 flex flex-col justify-between bg-linear-to-t from-ink/90 via-ink/40 to-ink/0 p-5 sm:p-8">
            <div>
              {isLive && (
                <span className="inline-flex items-center gap-2 rounded-full bg-brand-red px-3 py-1 text-sm leading-5 font-bold tracking-[0.05em] text-white uppercase shadow-[0_2px_4px_rgb(0_0_0/0.1),0_4px_6px_rgb(0_0_0/0.1)]">
                  <span className="size-2 animate-pulse rounded-full bg-white" />
                  Live
                </span>
              )}
            </div>
            <div className="flex items-end justify-between gap-4">
              <div className="flex max-w-[466px] flex-col gap-2">
                {title && <h1 className="text-[28px] leading-9 font-bold tracking-[-0.02em] text-white sm:text-5xl sm:leading-[56px]">{title}</h1>}
                {subtitle && <p className="text-base leading-7 text-white/90 sm:text-lg">{subtitle}</p>}
              </div>
              {streamUrl && (
                <button
                  type="button"
                  onClick={() => (embed ? setPlaying(true) : window.open(streamUrl, "_blank", "noopener"))}
                  aria-label="Play the service"
                  className="flex size-16 shrink-0 items-center justify-center rounded-full bg-brand-red pl-1 shadow-[0_8px_10px_rgb(0_0_0/0.1),0_20px_25px_rgb(0_0_0/0.1)] transition-transform hover:scale-105"
                >
                  <Image src="/icons/online/play.svg" alt="" width={16.5} height={21} />
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
