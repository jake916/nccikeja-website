"use client";

import Image from "next/image";
import { useState } from "react";

import { toYouTubeEmbed } from "@/lib/youtube";

/** Shows the thumbnail (passed as children) until play is pressed, then swaps in the video. */
export function VideoPlayer({ videoUrl, title, children }: { videoUrl: string | null; title: string; children: React.ReactNode }) {
  const [playing, setPlaying] = useState(false);
  const embed = videoUrl ? toYouTubeEmbed(videoUrl) : null;

  return (
    <div className="relative aspect-video overflow-hidden rounded-lg bg-[#e4e1e6] shadow-[0_8px_30px_rgb(21_26_75/0.08)]">
      {playing && embed ? (
        <iframe
          src={embed}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          className="absolute inset-0 size-full"
        />
      ) : (
        <>
          {children}
          <div className="absolute inset-0 flex items-center justify-center bg-ink/20">
            {videoUrl && (
              <button
                type="button"
                onClick={() => (embed ? setPlaying(true) : window.open(videoUrl, "_blank", "noopener"))}
                aria-label={`Play ${title}`}
                className="flex size-16 items-center justify-center rounded-full bg-white/90 pl-1 shadow-[0_4px_6px_rgb(0_0_0/0.1),0_10px_15px_rgb(0_0_0/0.1)] backdrop-blur-sm transition-transform hover:scale-105"
              >
                <Image src="/icons/sermons/play.svg" alt="" width={17} height={21} />
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
