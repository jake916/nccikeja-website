"use client";

import { Children, useEffect, useState } from "react";

import { cn } from "@/lib/cn";

/**
 * Cross-fades between its children every `interval` ms. Slides are rendered on the
 * server and passed in, so images still go through next/image. Respects reduced motion.
 */
export function Slideshow({ interval = 3000, children }: { interval?: number; children: React.ReactNode }) {
  const slides = Children.toArray(children);
  // `previous` stays fully visible underneath while `active` fades in over it, so the
  // background never shows through mid-swap.
  const [{ active, previous }, setSlide] = useState({ active: 0, previous: -1 });

  useEffect(() => {
    if (slides.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(
      () => setSlide(({ active }) => ({ active: (active + 1) % slides.length, previous: active })),
      interval,
    );
    return () => clearInterval(id);
  }, [slides.length, interval]);

  return (
    <div className="absolute inset-0 isolate" aria-hidden>
      {slides.map((slide, i) => (
        <div
          key={i}
          className={cn(
            "absolute inset-0",
            i === active
              ? "z-10 opacity-100 transition-opacity duration-1000 ease-in-out"
              : i === previous
                ? "opacity-100"
                : "opacity-0",
          )}
        >
          {slide}
        </div>
      ))}
    </div>
  );
}
