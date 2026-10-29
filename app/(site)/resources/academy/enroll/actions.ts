"use server";

import { getAcademyCourses, getAcademyPage } from "@/lib/content";
import { deliverSubmission, isSpam, readFields, type FormState } from "@/lib/forms/submission";

export async function enrol(_prev: FormState, formData: FormData): Promise<FormState> {
  if (isSpam(formData)) return { status: "success" };

  const { values, errors } = readFields(formData, {
    fullName: { required: true, max: 120 },
    email: { required: true, email: true, max: 160 },
    phone: { required: true, max: 40 },
    course: { required: true, max: 80 },
    statement: { max: 2000 },
  });
  if (errors) return { status: "error", errors };

  // The form posts the course's Sanity id; the email needs its name.
  const [courses, page] = await Promise.all([getAcademyCourses(), getAcademyPage()]);
  const course = courses.find((c) => c._id === values.course);
  const courseName = course ? `Level ${course.level}: ${course.title}` : values.course;

  return deliverSubmission(
    {
      _type: "enrolment",
      fullName: values.fullName,
      email: values.email,
      phone: values.phone,
      course: { _type: "reference", _ref: values.course },
      statement: values.statement,
    },
    {
      to: process.env.ACADEMY_EMAIL_TO,
      subject: `New World Changers Academy enrolment: ${values.fullName}`,
      heading: "New Academy Enrolment",
      intro: `${values.fullName} enrolled in the World Changers Academy through the website.`,
      replyTo: values.email,
      fields: [
        ["Full name", values.fullName],
        ["Email", values.email],
        ["Phone", values.phone],
        ["Course level", courseName],
        ["Personal statement", values.statement],
      ],
      // Uses the same success message and next steps editors set for the on-page dialog.
      confirmation: {
        to: values.email,
        name: values.fullName.split(/\s+/)[0],
        subject: "Your World Changers Academy enrolment",
        heading: page?.successHeading ?? "Enrollment Successful!",
        paragraphs: [
          `Thank you for enrolling in the World Changers Academy. We've received your enrolment for ${courseName}.`,
          ...(page?.successText ? [page.successText] : []),
        ],
        steps: page?.nextSteps ?? undefined,
        fields: [
          ["Course level", courseName],
          ["Phone", values.phone],
        ],
        reason: "you enrolled in the World Changers Academy",
      },
    },
  );
}
