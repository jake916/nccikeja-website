import type { Metadata } from "next";

import { CmsImage } from "@/components/ui/cms-image";
import { getOnlineChurchPage } from "@/lib/content";

import { ConnectForm } from "./connect-form";

export const metadata: Metadata = {
  title: "Connect With Us",
  description: "First time visiting or a returning member? Tell us about yourself and we'll be in touch.",
};

export default async function ConnectPage() {
  const page = await getOnlineChurchPage();

  return (
    <div className="bg-[#f8fafc] pb-24">
      <section className="relative mt-20 flex min-h-[420px] items-center justify-center overflow-hidden bg-ink px-6 pb-20 lg:h-[500px] lg:pb-10">
        <CmsImage image={page?.connectImage} alt="" sizes="100vw" preload />
        <div className="absolute inset-0 bg-ink/70" />
        <div className="relative flex max-w-[695px] flex-col items-center gap-6 px-6 text-center">
          <h1 className="text-[36px] leading-[44px] font-bold tracking-[-0.02em] text-white sm:text-5xl sm:leading-[56px]">
            {page?.connectHeading ?? "Connect With Us"}
          </h1>
          {page?.connectText && <p className="text-lg leading-7 text-white/90">{page.connectText}</p>}
        </div>
      </section>

      <section className="relative mx-4 -mt-14 max-w-[960px] rounded-2xl border border-[#f1f5f9] bg-white shadow-[0_8px_10px_rgb(0_0_0/0.1),0_20px_25px_rgb(0_0_0/0.1)] lg:mx-auto">
        <ConnectForm departments={page?.departments ?? []} />
      </section>
    </div>
  );
}
