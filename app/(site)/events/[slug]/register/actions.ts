"use server";

import { getEvent } from "@/lib/content";
import { formatFullDate } from "@/lib/format";
import { deliverSubmission, isSpam, readFields, type FormState } from "@/lib/forms/submission";

export async function registerForEvent(slug: string, _prev: FormState, formData: FormData): Promise<FormState> {
  if (isSpam(formData)) return { status: "success" };

  const { values, errors } = readFields(formData, {
    fullName: { required: true, max: 120 },
    email: { required: true, email: true, max: 160 },
    phone: { required: true, max: 40 },
    heardFrom: { max: 60 },
  });
  if (errors) return { status: "error", errors };

  // Looked up on the server so the email has the event's name and details, and closed events can't take sign-ups.
  const event = await getEvent(slug);
  if (!event?.registrationOpen) return { status: "error", message: "Registration for this event is closed." };
  const when = [formatFullDate(event.startDate), event.timeLabel].filter(Boolean).join(", ");

  return deliverSubmission(
    {
      _type: "eventRegistration",
      event: { _type: "reference", _ref: event._id },
      ...values,
      heardFrom: values.heardFrom || undefined,
    },
    {
      to: process.env.EVENTS_EMAIL_TO,
      subject: `New registration for ${event.title}: ${values.fullName}`,
      heading: "New Event Registration",
      intro: `${values.fullName} registered for ${event.title} through the website.`,
      replyTo: values.email,
      fields: [
        ["Event", event.title],
        ["Date", when],
        ["Full name", values.fullName],
        ["Email", values.email],
        ["Phone", values.phone],
        ["Heard about us from", values.heardFrom],
      ],
      confirmation: {
        to: values.email,
        name: values.fullName.split(/\s+/)[0],
        subject: `You're registered for ${event.title}`,
        heading: "Registration Successful!",
        paragraphs: [`We've received your registration for ${event.title}. See you there!`],
        fields: [
          ["Event", event.title],
          ["Date", when],
          ["Venue", [event.venue, event.address].filter(Boolean).join(", ")],
        ],
        reason: `you registered for ${event.title}`,
      },
    },
  );
}
