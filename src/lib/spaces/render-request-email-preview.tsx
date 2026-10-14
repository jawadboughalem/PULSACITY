import { render } from "react-email";
import { ReviewRequestEmail, buildReviewEmailSubject } from "@/emails/ReviewRequestEmail";
import { buildCustomerSenderName } from "@/lib/email/send-email";

/** The customer and offer of the example, when the space has no offer yet. */
const EXAMPLE_CUSTOMER = "Camille";

export const EXAMPLE_PRODUCT_NAME = "Programme 30 jours";

type RequestEmailPreviewInput = {
  spaceName: string;
  logoUrl: string | null;
  senderPostalAddress: string | null;
  productName: string | null;
  collectionUrl: string;
  now?: Date;
};

export type RequestEmailPreview = {
  sender: string;
  subject: string;
  html: string;
};

/**
 * Réglages, « Voir l'e-mail de demande »: the request e-mail exactly as it leaves, with the creator's name, logo and
 * address as typed, for a fictitious customer. Its links lead nowhere.
 */
export const renderRequestEmailPreview = async ({
  spaceName,
  logoUrl,
  senderPostalAddress,
  productName,
  collectionUrl,
  now = new Date(),
}: RequestEmailPreviewInput): Promise<RequestEmailPreview> => {
  const offer = productName ?? EXAMPLE_PRODUCT_NAME;
  const html = await render(
    <ReviewRequestEmail
      kind="request"
      spaceName={spaceName}
      logoUrl={logoUrl}
      firstName={EXAMPLE_CUSTOMER}
      productName={offer}
      eventType="sale"
      purchasedAt={now}
      reviewUrl={collectionUrl}
      unsubscribeUrl={collectionUrl}
      senderPostalAddress={senderPostalAddress}
    />,
  );
  return {
    sender: buildCustomerSenderName(spaceName),
    subject: buildReviewEmailSubject("request", EXAMPLE_CUSTOMER, offer),
    html,
  };
};
