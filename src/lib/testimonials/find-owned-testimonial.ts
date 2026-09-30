import { and, eq } from "drizzle-orm";
import type { Database } from "@/db/database";
import { spaces, testimonials } from "@/db/schema";

export type OwnedTestimonial = {
  id: string;
  spaceId: string;
  body: string;
  authorPhotoUrl: string | null;
};

export const findOwnedTestimonial = async (
  database: Database,
  userId: string,
  testimonialId: string,
): Promise<OwnedTestimonial | null> => {
  const [testimonial] = await database
    .select({
      id: testimonials.id,
      spaceId: testimonials.spaceId,
      body: testimonials.body,
      authorPhotoUrl: testimonials.authorPhotoUrl,
    })
    .from(testimonials)
    .innerJoin(spaces, eq(spaces.id, testimonials.spaceId))
    .where(and(eq(testimonials.id, testimonialId), eq(spaces.userId, userId)))
    .limit(1);
  return testimonial ?? null;
};
