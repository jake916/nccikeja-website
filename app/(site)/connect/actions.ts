"use server";

import { deliverSubmission, isSpam, readFields, type FormState } from "@/lib/forms/submission";

export async function submitConnect(_prev: FormState, formData: FormData): Promise<FormState> {
  if (isSpam(formData)) return { status: "success" };

  const returning = formData.get("visitorType") === "returning";
  const { values, errors } = readFields(formData, {
    title: { max: 20 },
    firstName: { required: true, max: 60 },
    lastName: { required: true, max: 60 },
    gender: { required: true, max: 20 },
    dateOfBirth: { max: 40 },
    maritalStatus: { max: 30 },
    occupation: { max: 100 },
    phone: { required: true, max: 40 },
    whatsapp: { max: 40 },
    email: { required: true, email: true, max: 160 },
    contactPreference: { max: 20 },
    address: { max: 200 },
    area: { max: 100 },
    city: { max: 100 },
    state: { max: 40 },
    visitDate: { max: 20 },
    heardFrom: { max: 60 },
    followUp: { max: 40 },
    isMember: { required: returning, max: 20 },
    joinedDate: { max: 20 },
    department: { max: 80 },
    academyLevel: { max: 20 },
    requestType: { required: returning, max: 60 },
    message: { max: 3000 },
  });
  if (!formData.get("consent")) {
    return { status: "error", errors: { ...errors, consent: "Please agree to be contacted so we can reply." } };
  }
  if (errors) return { status: "error", errors };

  const interests = formData.getAll("interests").map(String).slice(0, 12);
  const fullName = [values.title, values.firstName, values.lastName].filter(Boolean).join(" ");
  const visitor = returning ? "Returning visitor / member" : "First-time visitor";
  const location = [values.address, values.area, values.city, values.state].filter(Boolean).join(", ");

  const result = await deliverSubmission(
    {
      _type: "connectSubmission",
      visitorType: returning ? "returning" : "firstTime",
      ...Object.fromEntries(Object.entries(values).filter(([, v]) => v)),
      visitDate: /^\d{4}-\d{2}-\d{2}$/.test(values.visitDate) ? values.visitDate : undefined,
      interests: interests.length ? interests : undefined,
    },
    {
      to: process.env.CONNECT_EMAIL_TO,
      subject: returning
        ? `Connect form: ${values.requestType} from ${values.firstName} ${values.lastName}`
        : `New visitor: ${values.firstName} ${values.lastName}`,
      heading: returning ? "Connect Request" : "New Visitor",
      intro: `${values.firstName} ${values.lastName} filled the connect form on the website (${visitor.toLowerCase()}).`,
      replyTo: values.email,
      fields: [
        ["Visitor type", visitor],
        ["Name", fullName],
        ["Gender", values.gender],
        ["Date of birth / age range", values.dateOfBirth],
        ["Marital status", values.maritalStatus],
        ["Occupation", values.occupation],
        ["Phone", values.phone],
        ["WhatsApp", values.whatsapp],
        ["Email", values.email],
        ["Best way to reach them", values.contactPreference],
        ["Address", location],
        ["Visit date", values.visitDate],
        ["Heard about us from", values.heardFrom],
        ["Interests", interests.join(", ")],
        ["Follow-up", values.followUp],
        ["Member of this centre", values.isMember],
        ["Joined", values.joinedDate],
        ["Department or unit", values.department],
        ["Academy level completed", values.academyLevel],
        ["Request type", values.requestType],
        ["Message", values.message],
      ],
      confirmation: {
        to: values.email,
        name: values.firstName,
        subject: "Thank you for connecting with New Covenant Church",
        heading: "We've Received Your Message",
        paragraphs: [
          returning
            ? "Thank you for reaching out. We've received your message, and a member of our team will be in touch soon."
            : "Thank you for connecting with us. We're so glad you found us, and a member of our team will be in touch soon.",
        ],
        fields: [
          ["Request type", values.requestType],
          ["Message", values.message],
        ],
        reason: "you filled the connect form",
      },
    },
  );
  return result.status === "success" ? { status: "success", message: values.firstName } : result;
}
