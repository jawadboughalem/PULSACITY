import type { Database } from "./database";
import { testimonials } from "./schema";

type TestTestimonial = Partial<typeof testimonials.$inferInsert> & { spaceId: string };

export const insertTestTestimonial = async (database: Database, testimonial: TestTestimonial): Promise<string> => {
  const [inserted] = await database
    .insert(testimonials)
    .values({
      authorName: "Camille R.",
      rating: 5,
      body: "En 30 jours j'ai arrêté de grignoter le soir.",
      source: "manual",
      ...testimonial,
    })
    .returning({ id: testimonials.id });
  return inserted.id;
};
