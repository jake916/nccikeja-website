import type { Metadata } from "next";

import { CmsImage } from "@/components/ui/cms-image";
import { getAcademyCourses, getAcademyPage } from "@/lib/content";

import { EnrolForm } from "./enrol-form";

export const metadata: Metadata = {
  title: "Enroll in the Academy",
  description: "Secure your spot in the next World Changers Academy semester.",
};

export default async function EnrolPage() {
  const [page, courses] = await Promise.all([getAcademyPage(), getAcademyCourses()]);

  return (
    <div className="flex flex-col items-center bg-white pb-20">
      <section className="relative flex w-full items-center justify-center overflow-hidden bg-navy px-6 pt-[140px] pb-[120px] lg:h-[614px] lg:pt-[261px] lg:pb-[229px]">
        <CmsImage image={page?.enrolImage} alt="" sizes="100vw" preload />
        <div className="absolute inset-0 bg-black/85" />
        <div className="relative flex max-w-[920px] flex-col items-center gap-3 text-center">
          <h1 className="text-[40px] leading-[48px] font-bold tracking-[-0.02em] text-white sm:text-6xl sm:leading-[56px]">
            {page?.enrolHeading ?? "Begin Your Transformation"}
          </h1>
          {page?.enrolText && <p className="text-lg leading-7 text-[#e0e0ff] opacity-90 sm:text-[25px]">{page.enrolText}</p>}
        </div>
      </section>

      <section className="relative -mt-4 mx-4 w-[calc(100%-32px)] max-w-[672px] rounded-xl border border-outline/30 bg-white p-6 shadow-[0_4px_6px_rgb(0_0_0/0.1),0_10px_15px_rgb(0_0_0/0.1)] sm:p-12">
        <div className="flex flex-col gap-1 pb-12 text-center">
          <h2 className="text-2xl leading-8 font-semibold text-ink">{page?.formHeading ?? "Academy Enrollment"}</h2>
          {page?.formText && <p className="leading-6 text-muted">{page.formText}</p>}
        </div>
        <EnrolForm
          courses={courses.map((c) => ({ value: c._id, label: `${c.level} Level: ${c.title}` }))}
          success={{
            title: page?.successHeading ?? "Enrollment Successful!",
            message: page?.successText ?? null,
            nextSteps: page?.nextSteps ?? null,
          }}
        />
      </section>
    </div>
  );
}
