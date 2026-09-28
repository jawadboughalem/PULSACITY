import type { ReactElement } from "react";
import { render } from "react-email";
import { Resend } from "resend";
import { readRequiredEnvironmentVariable } from "@/lib/environment/read-required-environment-variable";
import { EmailNotSentError } from "./email-not-sent-error";
import { formatSender } from "./format-sender";

const ACCOUNT_SENDER_NAME = "PULSACITY";
const ACCOUNT_SENDER_LOCAL_PART = "notifications";

export type AccountEmail = {
  to: string;
  subject: string;
  body: ReactElement;
};

export const sendAccountEmail = async ({ to, subject, body }: AccountEmail): Promise<void> => {
  const [html, text] = await Promise.all([render(body), render(body, { plainText: true })]);

  if (!process.env.RESEND_API_KEY && process.env.NODE_ENV !== "production") {
    console.info(`[e-mail to ${to}] ${subject}\n\n${text}`);
    return;
  }

  const resend = new Resend(readRequiredEnvironmentVariable("RESEND_API_KEY"));
  const domain = readRequiredEnvironmentVariable("EMAIL_FROM_DOMAIN");
  const { error } = await resend.emails.send({
    from: formatSender(ACCOUNT_SENDER_NAME, `${ACCOUNT_SENDER_LOCAL_PART}@${domain}`),
    to,
    subject,
    html,
    text,
  });
  if (error) throw new EmailNotSentError(error.name, error.message);
};
