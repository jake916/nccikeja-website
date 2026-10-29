import Image from "next/image";

import { ButtonLink } from "./button";

/** Navy closing banner ("Experience God Anywhere") linking to the online service. */
export function CtaBanner({
  heading,
  text,
  action = { label: "Join Live Service", href: "/online-church" },
}: {
  heading: string;
  text?: string | null;
  action?: { label: string; href: string };
}) {
  return (
    <section className="relative overflow-hidden bg-navy px-6 py-20 lg:px-64 lg:py-[120px]">
      <div aria-hidden className="absolute inset-y-0 right-0 w-1/2 bg-linear-to-l from-ink/50 to-ink/0" />
      <div className="relative mx-auto flex max-w-[768px] flex-col items-center px-6 text-center">
        <Image src="/icons/sermons/globe.svg" alt="" width={54} height={78} />
        <h2 className="pb-4 text-[36px] leading-[44px] font-bold tracking-[-0.02em] text-white sm:text-5xl sm:leading-[56px]">{heading}</h2>
        {text && <p className="max-w-[672px] pb-8 text-lg leading-7 text-[#bec2fd]">{text}</p>}
        <ButtonLink href={action.href} size="lg" className="shadow-[0_4px_6px_rgb(0_0_0/0.1),0_10px_15px_rgb(0_0_0/0.1)]">
          {action.label}
        </ButtonLink>
      </div>
    </section>
  );
}
