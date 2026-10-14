import { type ContactSenderSpace, ContactMessageEmail } from "@/emails/ContactMessageEmail";
import { sendSupportEmail } from "@/lib/email/send-email";
import type { ContactMessage } from "./contact-message";
import { SUPPORT_EMAIL } from "./support-address";

/** To PULSACITY's one address, under the sender's own subject: answering it writes to the sender. */
export const sendContactMessageEmail = ({ email, subject, message }: ContactMessage, space: ContactSenderSpace | null) =>
  sendSupportEmail({
    to: SUPPORT_EMAIL,
    subject,
    body: <ContactMessageEmail email={email} subject={subject} message={message} space={space} />,
    replyTo: email,
  });
