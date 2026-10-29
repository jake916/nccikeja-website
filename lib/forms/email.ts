import "server-only";

import { readFileSync } from "node:fs";
import path from "node:path";

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.FORMS_EMAIL_FROM;

// Sent as an inline attachment, since the site may not be publicly reachable to host it. Traced into the build in next.config.ts.
const logo = readLogo();

function readLogo() {
  try {
    return readFileSync(path.join(process.cwd(), "assets/email-logo.png")).toString("base64");
  } catch (error) {
    console.error("Email logo missing; sending emails without it", error);
    return null;
  }
}

type Fields = [label: string, value: string | undefined][];

export type SubmissionEmail = {
  /** Comma-separated inbox list; read from the form's own env var with FORMS_EMAIL_TO as the fallback. */
  to: string | undefined;
  subject: string;
  heading: string;
  intro: string;
  fields: Fields;
  /** The person who filled the form, so the team can reply straight from their inbox. */
  replyTo?: string;
  /** "We received it" email to the person who filled the form; replies go to the team inbox. */
  confirmation?: {
    to: string;
    name: string;
    subject: string;
    heading: string;
    paragraphs: string[];
    /** Optional numbered list, e.g. next steps. */
    steps?: string[];
    /** A copy of what they sent, for their records. */
    fields?: Fields;
    /** Says why they got the email, e.g. "you shared a testimony". */
    reason: string;
  };
};

/**
 * Emails a form submission to the church team through Resend. Returns whether the team email was sent.
 * The confirmation goes out only after that succeeds, and its own failure doesn't count against the submission.
 */
export async function sendSubmissionEmail(email: SubmissionEmail): Promise<boolean> {
  const team = splitList(email.to || process.env.FORMS_EMAIL_TO);
  if (!team.length) return false;

  const fields = filled(email.fields);
  const sent = await send({
    to: team,
    subject: email.subject,
    replyTo: email.replyTo,
    html: layout(
      email.heading,
      `${paragraph(email.intro)}${fieldTable(fields)}`,
      `Submitted ${lagosTime()} via the church website. Reply to this email to respond to the sender.`,
    ),
    text: [email.heading, "", email.intro, "", textFields(fields), `Submitted ${lagosTime()} via the church website.`].join("\n"),
  });

  const confirmation = email.confirmation;
  if (sent && confirmation) {
    const copy = filled(confirmation.fields ?? []);
    const steps = confirmation.steps?.filter(Boolean) ?? [];
    const signOff = "God bless you,<br />New Covenant Church, Ikeja";
    await send({
      to: [confirmation.to],
      subject: confirmation.subject,
      replyTo: team[0],
      html: layout(
        confirmation.heading,
        [
          paragraph(`Dear ${confirmation.name},`),
          ...confirmation.paragraphs.map(paragraph),
          steps.length ? stepList(steps) : "",
          copy.length ? `${paragraph("Here's a copy of what you sent us:")}${fieldTable(copy)}` : "",
          `<p style="margin:24px 0 0;font-size:16px;line-height:24px;color:#00012d;">${signOff}</p>`,
        ].join(""),
        `You're receiving this because ${confirmation.reason} on the New Covenant Church website. Reply to this email if you have any questions.`,
      ),
      text: [
        `Dear ${confirmation.name},`,
        "",
        ...confirmation.paragraphs.flatMap((p) => [p, ""]),
        ...(steps.length ? [...steps.map((step, i) => `${i + 1}. ${step}`), ""] : []),
        ...(copy.length ? ["Here's a copy of what you sent us:", "", textFields(copy)] : []),
        "God bless you,",
        "New Covenant Church, Ikeja",
      ].join("\n"),
    });
  }

  return sent;
}

async function send(message: { to: string[]; subject: string; replyTo?: string; html: string; text: string }) {
  if (!apiKey || !from) return false;
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: message.to,
        subject: message.subject,
        reply_to: message.replyTo,
        html: message.html,
        text: message.text,
        attachments: logo ? [{ content: logo, filename: "logo.png", content_type: "image/png", content_id: "logo" }] : undefined,
      }),
    });
    if (!response.ok) {
      console.error("Resend rejected form email", response.status, await response.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error("Failed to send form email", error);
    return false;
  }
}

const splitList = (value: string | undefined) =>
  (value ?? "")
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);

const filled = (fields: Fields) => fields.filter((field): field is [string, string] => Boolean(field[1]));

const lagosTime = () =>
  new Date().toLocaleString("en-GB", { timeZone: "Africa/Lagos", dateStyle: "full", timeStyle: "short" });

const textFields = (fields: [string, string][]) => fields.map(([label, value]) => `${label}:\n${value}\n`).join("\n");

function escape(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const paragraph = (text: string) =>
  `<p style="margin:0 0 16px;font-size:16px;line-height:24px;color:#46464f;white-space:pre-wrap;">${escape(text)}</p>`;

function fieldTable(fields: [string, string][]) {
  const rows = fields
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:16px 0;border-bottom:1px solid #ececf1;">
            <div style="font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#46464f;font-weight:600;margin-bottom:6px;">${escape(label)}</div>
            <div style="font-size:16px;line-height:24px;color:#00012d;white-space:pre-wrap;">${escape(value)}</div>
          </td>
        </tr>`,
    )
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>`;
}

function stepList(steps: string[]) {
  const rows = steps
    .map(
      (step, i) => `
        <tr>
          <td valign="top" style="padding:0 12px 12px 0;width:28px;">
            <div style="width:28px;height:28px;border-radius:14px;background:#cca830;color:#151a4b;font-size:14px;line-height:28px;font-weight:700;text-align:center;">${i + 1}</div>
          </td>
          <td valign="top" style="padding:3px 0 12px;font-size:16px;line-height:22px;color:#00012d;">${escape(step)}</td>
        </tr>`,
    )
    .join("");
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:4px 0 16px;">${rows}</table>`;
}

// Table layout with inline styles: the only markup email clients render reliably.
function layout(heading: string, body: string, footer: string) {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f4f4f7;font-family:Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="background:#151a4b;padding:28px 32px;border-bottom:4px solid #cca830;">
                ${
                  logo
                    ? `<img src="cid:logo" width="150" height="60" alt="New Covenant Church, Ikeja" style="display:block;border:0;width:150px;height:60px;" />`
                    : `<div style="font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#cca830;font-weight:700;">New Covenant Church, Ikeja</div>`
                }
                <div style="font-size:24px;line-height:32px;color:#ffffff;font-weight:700;margin-top:${logo ? 20 : 8}px;">${escape(heading)}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 32px 8px;">${body}</td>
            </tr>
            <tr>
              <td style="padding:20px 32px 28px;font-size:13px;line-height:20px;color:#8a8a96;">${escape(footer)}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
