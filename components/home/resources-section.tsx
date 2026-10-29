import Image from "next/image";
import Link from "next/link";

import { buttonClasses } from "@/components/ui/button";
import { Section } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

const resources = [
  {
    title: "The Academy",
    text: "The World Changers Academy is our training pathway, with five levels from Biblical Foundation to Leadership, Finance and Empowerment.",
    href: "/resources/academy",
    cta: "Explore Courses",
    icon: { src: "/icons/academy-lg.svg", width: 33, height: 24 },
    tint: "bg-gold/10",
    filled: true,
  },
  {
    title: "Latest Sermons",
    text: "Fresh teaching from our pulpit, in a monthly series that helps you grow step by step.",
    href: "/resources/sermons",
    cta: "Browse Sermons",
    icon: { src: "/icons/sermons.svg", width: 27, height: 27 },
    tint: "bg-navy/10",
    filled: false,
  },
  {
    title: "Publications",
    text: "Books, articles and resources to deepen your faith and strengthen your walk.",
    href: "/resources/publications",
    cta: "View All",
    icon: { src: "/icons/publications.svg", width: 30, height: 30 },
    tint: "bg-gold/10",
    filled: false,
  },
];

export function ResourcesSection() {
  return (
    <Section className="bg-surface-bright" containerClassName="flex flex-col items-center gap-12">
      <SectionHeading
        align="center"
        title="Resources for Growth"
        description="Equip yourself with biblical teaching and practical wisdom for everyday life."
      />

      <ul className="grid w-full gap-8 md:grid-cols-3">
        {resources.map((item) => (
          <li key={item.title}>
            <Link
              href={item.href}
              className="group flex h-full min-h-[400px] flex-col items-center justify-between gap-6 rounded-xl border border-outline/20 bg-white p-8 text-center shadow-card-sm transition-transform hover:-translate-y-1"
            >
              <div className="flex flex-col items-center gap-4">
                <span className={`mb-2 flex size-20 items-center justify-center rounded-full ${item.tint}`}>
                  <Image src={item.icon.src} alt="" width={item.icon.width} height={item.icon.height} />
                </span>
                <h3 className="text-2xl leading-8 font-semibold text-navy">{item.title}</h3>
                <p className="leading-6 text-muted">{item.text}</p>
              </div>
              <span
                className={buttonClasses({
                  variant: item.filled ? "navy" : "outline-navy",
                  size: "compact",
                })}
              >
                {item.cta}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
