import type { ReactElement } from "react";
import { render } from "react-email";
import { Resend } from "resend";
import { readRequiredEnvironmentVariable } from "@/lib/environment/read-required-environment-variable";
import { EmailNotSentError } from "./email-not-sent-error";
import { formatSender } from "./format-sender";

const ACCOUNT_SENDER_NAME = "PULSACITY";
const ACCOUNT_SENDER_LOCAL_PART = "notifications";

/** The technical address of the e-mails sent on behalf of a creator: the answers go to the creator. */
const CUSTOMER_SENDER_LOCAL_PART = "avis";

export type AccountEmail = {
  to: string;
  subject: string;
  body: ReactElement;
};

/** An e-mail to a creator's customer: in the creator's name, with a way out in every message. */
export type CustomerEmail = {
  to: string;
  subject: string;
  body: ReactElement;
  spaceName: string;
  replyTo: string;
  unsubscribeUrl: string;
  /** The same message sent twice within a day reaches the customer once. */
  idempotencyKey: string;
};

type Message = {
  senderName: string;
  senderLocalPart: string;
  to: string;
  subject: string;
  body: ReactElement;
  replyTo?: string;
  headers?: Record<string, string>;
  idempotencyKey?: string;
};

const deliver = async ({ senderName, senderLocalPart, to, subject, body, replyTo, headers, idempotencyKey }: Message) => {
  const [html, text] = await Promise.all([render(body), render(body, { plainText: true })]);

  if (!process.env.RESEND_API_KEY && process.env.NODE_ENV !== "production") {
    console.info(`[e-mail to ${to}] ${subject}\n\n${text}`);
    return;
  }

  const resend = new Resend(readRequiredEnvironmentVariable("RESEND_API_KEY"));
  const domain = readRequiredEnvironmentVariable("EMAIL_FROM_DOMAIN");
  const payload = {
    from: formatSender(senderName, `${senderLocalPart}@${domain}`),
    to,
    subject,
    html,
    text,
    ...(replyTo ? { replyTo } : {}),
    ...(headers ? { headers } : {}),
  };
  const { error } = idempotencyKey
    ? await resend.emails.send(payload, { idempotencyKey })
    : await resend.emails.send(payload);
  if (error) throw new EmailNotSentError(error.name, error.message);
};

export const sendAccountEmail = ({ to, subject, body }: AccountEmail): Promise<void> =>
  deliver({ senderName: ACCOUNT_SENDER_NAME, senderLocalPart: ACCOUNT_SENDER_LOCAL_PART, to, subject, body });

export const sendCustomerEmail = ({
  to,
  subject,
  body,
  spaceName,
  replyTo,
  unsubscribeUrl,
  idempotencyKey,
}: CustomerEmail): Promise<void> =>
  deliver({
    senderName: `${spaceName} via PULSACITY`,
    senderLocalPart: CUSTOMER_SENDER_LOCAL_PART,
    to,
    subject,
    body,
    replyTo,
    headers: { "List-Unsubscribe": `<${unsubscribeUrl}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" },
    idempotencyKey,
  });
