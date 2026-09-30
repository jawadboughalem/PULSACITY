import { and, count, eq, sql } from "drizzle-orm";
import { canAddTestimonial, getPlan } from "@/config/plans";
import type { Database } from "@/db/database";
import { products, spaces, testimonials } from "@/db/schema";
import { getUploadPublicUrl } from "@/lib/uploads/presign-image-upload";
import { isTestimonialPhotoKeyOf } from "@/lib/uploads/upload-keys";
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
  | { status: "added"; testimonialId: string }
  | { status: "space-not-found" }
  | { status: "product-not-found" }
  | { status: "invalid-photo" }
  | { status: "plan-limit-reached"; planName: string; testimonialLimit: number | null };

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

    const [{ testimonialCount }] = await transaction
      .select({ testimonialCount: count() })
      .from(testimonials)
      .where(eq(testimonials.spaceId, space.id));
    if (!canAddTestimonial(space, testimonialCount)) {
      const plan = getPlan(space.plan);
      return { status: "plan-limit-reached", planName: plan.name, testimonialLimit: plan.limits.testimonials };
    }

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
        status: "approved",
        source: "manual",
        consentAt: now,
        consentText: MANUAL_CONSENT_TEXT,
        createdAt: testimonial.receivedAt ?? now,
      })
      .returning({ id: testimonials.id });
    return { status: "added", testimonialId: inserted.id };
  });
