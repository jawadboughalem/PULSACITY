import { and, eq, sql } from "drizzle-orm";
import { canAddTestimonial, getPlan } from "@/config/plans";
import type { Database } from "@/db/database";
import { products, spaces, testimonials } from "@/db/schema";
import { getUploadPublicUrl } from "@/lib/uploads/presign-image-upload";
import { isTestimonialPhotoKeyOf } from "@/lib/uploads/upload-keys";
import { claimFirstApproval } from "./claim-first-approval";
import { countApprovedTestimonials } from "./count-approved-testimonials";
import { MANUAL_CONSENT_TEXT } from "./manual-consent";

export type ManualTestimonial = {
  productId: string | null;
  authorName: string;
  authorTitle: string | null;
  rating: number;
  body: string;
  receivedAt: Date | null;
  photoKey: string | null;
};

export type AddManualTestimonialResult =
  | {
      status: "added";
      testimonialId: string;
      isFirstApproval: boolean;
      plan: { name: string; testimonialLimit: number | null } | null;
    }
  | { status: "space-not-found" }
  | { status: "product-not-found" }
  | { status: "invalid-photo" };

export const addManualTestimonial = (
  database: Database,
  userId: string,
  spaceId: string,
  testimonial: ManualTestimonial,
  now = new Date(),
): Promise<AddManualTestimonialResult> =>
  database.transaction(async (transaction): Promise<AddManualTestimonialResult> => {
    await transaction.execute(sql`select pg_advisory_xact_lock(hashtext(${`add-testimonials:${spaceId}`}))`);
    const [space] = await transaction
      .select({ id: spaces.id, plan: spaces.plan })
      .from(spaces)
      .where(and(eq(spaces.id, spaceId), eq(spaces.userId, userId)))
      .limit(1);
    if (!space) return { status: "space-not-found" };

    if (testimonial.productId) {
      const [product] = await transaction
        .select({ id: products.id })
        .from(products)
        .where(and(eq(products.id, testimonial.productId), eq(products.spaceId, space.id)))
        .limit(1);
      if (!product) return { status: "product-not-found" };
    }
    if (testimonial.photoKey && !isTestimonialPhotoKeyOf(space.id, testimonial.photoKey)) {
      return { status: "invalid-photo" };
    }

    const isWithinPlan = canAddTestimonial(space, await countApprovedTestimonials(transaction, space.id));
    const plan = getPlan(space.plan);

    const [inserted] = await transaction
      .insert(testimonials)
      .values({
        spaceId: space.id,
        productId: testimonial.productId,
        authorName: testimonial.authorName,
        authorTitle: testimonial.authorTitle,
        authorPhotoUrl: testimonial.photoKey ? getUploadPublicUrl(testimonial.photoKey) : null,
        rating: testimonial.rating,
        body: testimonial.body,
        status: isWithinPlan ? "approved" : "pending",
        source: "manual",
        consentAt: now,
        consentText: MANUAL_CONSENT_TEXT,
        createdAt: testimonial.receivedAt ?? now,
      })
      .returning({ id: testimonials.id });
    return {
      status: "added",
      testimonialId: inserted.id,
      isFirstApproval: isWithinPlan && (await claimFirstApproval(transaction, space.id, now)),
      plan: isWithinPlan ? null : { name: plan.name, testimonialLimit: plan.limits.testimonials },
    };
  });
