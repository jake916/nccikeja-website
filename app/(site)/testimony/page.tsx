import type { Metadata } from "next";
import Image from "next/image";

import { CmsImage } from "@/components/ui/cms-image";
import { getTestimonyPage } from "@/lib/content";

import { TestimonyForm } from "./testimony-form";

export const metadata: Metadata = {
  title: "Testimonies",
  description: "Share what God has done in your life, and watch stories from the NCC Ikeja family.",
};

export default async function TestimonyPage() {
  const page = await getTestimonyPage();

  return (
    <div className="bg-[#f9fafb]">
      <section className="relative overflow-hidden bg-[#000114] px-6 pt-36 pb-28 lg:h-[674px] lg:px-48 lg:pt-48 lg:pb-32">
        <CmsImage image={page?.heroImage} alt="" sizes="100vw" preload className="object-cover opacity-50" />
        <div className="absolute inset-0 bg-linear-to-b from-ink/80 via-ink/60 to-[#000114]" />
        <div className="relative mx-auto flex max-w-[896px] flex-col items-center gap-6 px-8 text-center">
          <span className="rounded-full border border-[#e5e7eb] px-4 py-1.5 text-xs leading-4 font-semibold tracking-[0.05em] text-white uppercase backdrop-blur-sm">
            Testimonies
          </span>
          <h1 className="max-w-[520px] pt-2 text-[40px] leading-[44px] font-bold text-white sm:text-6xl sm:leading-[60px]">
            {page?.heroHeading ?? "Testimonies"}
          </h1>
          {page?.heroText && <p className="max-w-[672px] text-lg leading-7 font-light text-white sm:text-xl">{page.heroText}</p>}
          {page?.watchUrl && (
            <a
              href={page.watchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center gap-2 rounded-full bg-[#ef4444] px-8 py-3.5 leading-6 font-medium text-white shadow-[0_4px_6px_rgb(239_68_68/0.3),0_10px_15px_rgb(239_68_68/0.3)] transition-colors hover:bg-[#dc2626]"
            >
              <Image src="/icons/testimony/play.svg" alt="" width={16.25} height={16.25} />
              Watch Testimonies
            </a>
          )}
        </div>
      </section>

      <section className="relative -mt-9 rounded-t-3xl bg-white px-4 py-20 shadow-[0_-10px_40px_rgb(0_0_0/0.05)] sm:px-8 lg:py-32">
        <div className="mx-auto flex max-w-[704px] flex-col gap-12">
          <div className="flex flex-col items-center gap-4 text-center">
            <h2 className="text-[32px] leading-10 font-bold text-[#1f2937] sm:text-4xl">{page?.formHeading ?? "Share Your Testimony"}</h2>
            {page?.formText && <p className="max-w-[576px] leading-6 text-[#4b5563]">{page.formText}</p>}
          </div>
          <div className="rounded-2xl border border-[#f3f4f6] bg-white p-6 shadow-[0_8px_10px_rgb(229_231_235/0.5),0_20px_25px_rgb(229_231_235/0.5)] sm:p-10">
            <TestimonyForm expressions={page?.expressions ?? []} categories={page?.categories ?? []} />
          </div>
        </div>
      </section>
    </div>
  );
}
