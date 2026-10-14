import { z } from "zod";
import type { RateLimitRule } from "@/lib/rate-limit/consume-rate-limit";

export const MAX_CONTACT_SUBJECT_LENGTH = 120;

export const MAX_CONTACT_MESSAGE_LENGTH = 5000;

const INCOMPLETE_EMAIL = "Cette adresse e-⁠mail est incomplète. Écrivez-la en entier, par exemple julie@exemple.fr.";

/** « Écrivez-nous » (/aide): the address the answer goes to, the subject on one line, the message as typed. */
export const contactMessageSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, { error: "Indiquez votre adresse e-⁠mail : c'est là que nous vous répondrons." })
    .pipe(z.email({ error: INCOMPLETE_EMAIL })),
  subject: z
    .string()
    .transform((subject) => subject.replace(/\s+/g, " ").trim())
    .pipe(
      z
        .string()
        .min(1, { error: "Indiquez le sujet de votre message." })
        .max(MAX_CONTACT_SUBJECT_LENGTH, {
          error: `Ce sujet dépasse ${MAX_CONTACT_SUBJECT_LENGTH} caractères. Raccourcissez-le.`,
        }),
    ),
  message: z
    .string()
    .transform((message) => message.replace(/\r\n?/g, "\n").trim())
    .pipe(
      z
        .string()
        .min(1, { error: "Écrivez votre message." })
        .max(MAX_CONTACT_MESSAGE_LENGTH, {
          error: `Ce message dépasse ${MAX_CONTACT_MESSAGE_LENGTH.toLocaleString("fr-FR")} caractères. Raccourcissez-le.`,
        }),
    ),
});

export type ContactMessage = z.infer<typeof contactMessageSchema>;

/** The fields of the form, in the order of the page. */
export const CONTACT_FIELDS = ["email", "subject", "message"] as const;

export type ContactField = (typeof CONTACT_FIELDS)[number];

export type ContactFieldErrors = Partial<Record<ContactField, string>>;

export const collectContactErrors = (error: z.ZodError): ContactFieldErrors => {
  const { fieldErrors } = z.flattenError(error) as { fieldErrors: Partial<Record<string, string[]>> };
  return Object.fromEntries(
    CONTACT_FIELDS.flatMap((field) => {
      const message = fieldErrors[field]?.[0];
      return message ? [[field, message]] : [];
    }),
  );
};

/** One visitor, a few messages in a quarter of an hour: « Patientez quelques minutes » stays true. */
export const CONTACT_MESSAGES_PER_IP: RateLimitRule = {
  name: "contact-message-ip",
  limit: 3,
  windowSeconds: 15 * 60,
};

/**
 * One address, a few messages in a quarter of an hour, whatever the network: an IP can change from one message to the
 * next (IPv6, a phone moving between networks), an address typed does not.
 */
export const CONTACT_MESSAGES_PER_ADDRESS: RateLimitRule = {
  name: "contact-message-address",
  limit: 3,
  windowSeconds: 15 * 60,
};

/**
 * Every visitor together, in a day. The messages share Resend's daily quota with the review requests of the creators:
 * a flood of messages must never stop their requests. To raise with Resend Pro (lot 4.12).
 */
export const CONTACT_MESSAGES_PER_DAY: RateLimitRule = {
  name: "contact-message-all",
  limit: 30,
  windowSeconds: 24 * 60 * 60,
};

/** The key of the daily limit, the same for everyone. */
export const EVERY_VISITOR = "all";
