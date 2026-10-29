import type { Metadata } from "next";
import Image from "next/image";

import { ButtonLink } from "@/components/ui/button";
import { CmsImage } from "@/components/ui/cms-image";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/cn";
import { getAcademyCourses, getAcademyPage } from "@/lib/content";
import type { AcademyCourse } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "World Changers Academy",
  description: "Our EQUIP training programme: five levels from Biblical Foundation to Empowerment.",
};

const courseIcons: Record<string, { src: string; width: number; height: number }> = {
  foundation: { src: "/icons/academy/level-100.svg", width: 30, height: 24 },
  couple: { src: "/icons/academy/level-200.svg", width: 28, height: 27 },
  globe: { src: "/icons/academy/level-300.svg", width: 24, height: 24 },
  growth: { src: "/icons/academy/level-400.svg", width: 24, height: 14 },
  award: { src: "/icons/academy/level-500.svg", width: 19, height: 25 },
};

/** Card treatments from the design's bento grid, applied in course order. */
const tones = [
  { badge: "border-[#555a8e]/20 bg-[#555a8e]/10 text-[#555a8e]" },
  { badge: "border-[#ffb4a8]/50 bg-[#ffdad4]/30 text-[#410000]" },
  { badge: "border-[#e9c349]/50 bg-butter/30 text-on-butter" },
  { badge: "border-outline/50 bg-[#e4e1e6] text-body" },
  { badge: "border-transparent bg-gold text-[#4f3e00] shadow-[0_1px_2px_rgb(0_0_0/0.05)]", dark: true },
];

export default async function AcademyPage() {
  const [page, courses] = await Promise.all([getAcademyPage(), getAcademyCourses()]);

  return (
    <>
      <section className="relative flex min-h-[520px] items-center justify-center overflow-hidden bg-navy px-6 pt-20 pb-20 lg:h-[614px] lg:pt-[118px] lg:pb-[122px]">
        <CmsImage image={page?.heroImage} alt="" sizes="100vw" preload />
        <div className="absolute inset-0 bg-black/85" />
        <div className="relative flex max-w-[1060px] flex-col items-center gap-6 text-center">
          {page?.heroTag && (
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#bec2fd]/20 bg-[#e0e0ff]/50 px-3 py-1 backdrop-blur-sm">
              <Image src="/icons/academy/cap.svg" alt="" width={15} height={12} />
              <span className="text-sm leading-5 font-medium tracking-[0.05em] text-[#bec2fd] uppercase">{page.heroTag}</span>
            </span>
          )}
          <h1 className="text-[40px] leading-[48px] font-bold tracking-[-0.02em] text-white sm:text-6xl sm:leading-[56px]">
            {page?.heroHeading ?? "World Changers Academy"}
          </h1>
          {page?.heroText && <p className="px-3 text-lg leading-[29px] text-white sm:text-[25px]">{page.heroText}</p>}
          <div className="pt-8">
            <ButtonLink href="#courses" variant="ink" shape="rounded" size="md" className="px-12">
              Explore Courses
              <Image src="/icons/academy/arrow-down.svg" alt="" width={14} height={14} />
            </ButtonLink>
          </div>
        </div>
      </section>

      <Container className="py-10">
        <ul id="courses" className="mx-auto grid max-w-[1152px] scroll-mt-32 gap-6 md:grid-cols-2 lg:grid-cols-6 lg:gap-y-7">
          {courses.map((course, i) => (
            <CourseCard key={course._id} course={course} index={i} />
          ))}
        </ul>
      </Container>

      <section className="flex flex-col items-center gap-10 px-6 pt-2 pb-[72px] text-center">
        {page?.ctaText && (
          <p className="max-w-[1000px] text-xl leading-8 font-semibold tracking-[0.02em] whitespace-pre-line text-black sm:text-2xl">
            {page.ctaText}
          </p>
        )}
        <ButtonLink href="/resources/academy/enroll" variant="ink" shape="rounded" size="form" className="px-20">
          Enroll Now
          <Image src="/icons/academy/arrow-right.svg" alt="" width={16} height={16} />
        </ButtonLink>
      </section>
    </>
  );
}

function CourseCard({ course, index }: { course: AcademyCourse; index: number }) {
  const tone = tones[index % tones.length];
  const large = index < 2;
  const icon = course.icon ? courseIcons[course.icon] : undefined;

  return (
    <li
      className={cn(
        "relative flex flex-col overflow-hidden rounded-xl",
        large ? "p-8 sm:p-12 lg:col-span-3 lg:min-h-[346px]" : "p-6 lg:col-span-2 lg:min-h-[260px]",
        tone.dark
          ? "bg-ink shadow-[0_2px_4px_rgb(0_0_0/0.1),0_4px_6px_rgb(0_0_0/0.1)] md:col-span-2 lg:col-span-2"
          : "border border-outline bg-white",
      )}
    >
      {tone.dark && (
        <span aria-hidden className="absolute inset-0 bg-[radial-gradient(circle,#151a4b_0%,#00012d_50%)] opacity-80" />
      )}

      <div className="relative flex items-center justify-between pb-6">
        <span className={cn("rounded-full border px-3 py-1 text-sm leading-5 font-medium tracking-[0.01em]", tone.badge)}>
          {course.level} Level
        </span>
        {icon && <Image src={icon.src} alt="" width={icon.width} height={icon.height} />}
      </div>
      <h2
        className={cn(
          "relative text-2xl font-semibold",
          large ? "pb-3 leading-8" : "pb-2 leading-[30px]",
          tone.dark ? "text-white" : "text-ink",
        )}
      >
        {course.title}
      </h2>
      {course.description && (
        <p className={cn("relative", large ? "leading-6" : "text-sm leading-5", tone.dark ? "text-[#bec2fd]" : "text-body")}>
          {course.description}
        </p>
      )}
      {tone.dark && <span aria-hidden className="relative mt-auto border-b border-navy pt-12" />}
    </li>
  );
}
