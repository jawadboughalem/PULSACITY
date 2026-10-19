import { eq } from "drizzle-orm";
import type { Database } from "@/db/database";
import { customers, products, spaces, testimonials } from "@/db/schema";
import type { CustomerEmailSpace } from "@/emails/CustomerEmailLayout";
import type { HiddenReason } from "./hidden-reasons";
import type { TestimonialStatus } from "./testimonial-filters";

/**
 * Everything an e-mail to the author of a testimonial needs: the address PULSACITY received with the sale or typed in
 * « Demander un avis ». A testimonial added, imported or left from the public link has none: nothing can reach its
 * author.
 */
export type AuthorContact = {
  testimonialId: string;
  status: TestimonialStatus;
  createdAt: Date;
  hiddenAt: Date | null;
  hiddenReason: HiddenReason | null;
  hiddenReasonDetail: string | null;
  hiddenReasonSentAt: Date | null;
  customerId: string | null;
  email: string | null;
  firstName: string | null;
  unsubscribedAt: Date | null;
  productName: string | null;
  spaceSlug: string;
  replyToEmail: string;
  space: CustomerEmailSpace;
};

export const loadAuthorContact = async (database: Database, testimonialId: string): Promise<AuthorContact | null> => {
  const [row] = await database
    .select({
      testimonialId: testimonials.id,
      status: testimonials.status,
      createdAt: testimonials.createdAt,
      hiddenAt: testimonials.hiddenAt,
      hiddenReason: testimonials.hiddenReason,
      hiddenReasonDetail: testimonials.hiddenReasonDetail,
      hiddenReasonSentAt: testimonials.hiddenReasonSentAt,
      customerId: customers.id,
      email: customers.email,
      firstName: customers.firstName,
      unsubscribedAt: customers.unsubscribedAt,
      productName: products.name,
      spaceSlug: spaces.slug,
      replyToEmail: spaces.replyToEmail,
      spaceName: spaces.name,
      logoUrl: spaces.logoUrl,
      accentColor: spaces.accentColor,
      senderPostalAddress: spaces.senderPostalAddress,
    })
    .from(testimonials)
    .innerJoin(spaces, eq(spaces.id, testimonials.spaceId))
    .leftJoin(customers, eq(customers.id, testimonials.customerId))
    .leftJoin(products, eq(products.id, testimonials.productId))
    .where(eq(testimonials.id, testimonialId))
    .limit(1);
  if (!row) return null;
  const { spaceName, logoUrl, accentColor, senderPostalAddress, ...contact } = row;
  return { ...contact, space: { name: spaceName, logoUrl, accentColor, senderPostalAddress } };
};

/** Who can be written to: an address known, and not unsubscribed from the creator's e-mails. */
export type AuthorReach = "reachable" | "no-address" | "unsubscribed";

export const readAuthorReach = (contact: Pick<AuthorContact, "email" | "unsubscribedAt">): AuthorReach => {
  if (!contact.email) return "no-address";
  return contact.unsubscribedAt ? "unsubscribed" : "reachable";
};
