import type { RateLimitRule } from "@/lib/rate-limit/consume-rate-limit";

const TEN_MINUTES = 10 * 60;

export const TESTIMONIALS_PER_IP: RateLimitRule = {
  name: "testimonial-ip",
  limit: 10,
  windowSeconds: TEN_MINUTES,
};

export const TESTIMONIAL_PHOTOS_PER_IP: RateLimitRule = {
  name: "testimonial-photo-ip",
  limit: 20,
  windowSeconds: TEN_MINUTES,
};
