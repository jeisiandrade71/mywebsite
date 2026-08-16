import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(input: {
  to: string;
  subject: string;
  html: string;
}) {
  const from = process.env.RESEND_FROM_EMAIL;
  if (!from) {
    throw new Error("Missing RESEND_FROM_EMAIL environment variable");
  }

  return resend.emails.send({
    from: `J&A Cleaning Group <${from}>`,
    to: input.to,
    subject: input.subject,
    html: input.html,
  });
}
