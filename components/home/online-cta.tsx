import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/ui/container";

export function OnlineCta() {
  return (
    <Section className="relative overflow-hidden bg-navy" containerClassName="relative">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgb(204_168_48/0.4)_0,transparent_520px)] opacity-10"
      />
      <div className="relative mx-auto flex max-w-[896px] flex-col items-center gap-6 text-center">
        <h2 className="text-[28px] leading-9 font-bold tracking-[-0.01em] text-white lg:text-[32px] lg:leading-10">
          Experience Church Online
        </h2>
        <p className="pb-4 text-lg leading-7 text-white/80">
          Can&apos;t be with us in person? Join our livestream and connect with a family of world changers, wherever
          you are.
        </p>
        <ButtonLink href="/online-church">
          Join Online Service
        </ButtonLink>
      </div>
    </Section>
  );
}
