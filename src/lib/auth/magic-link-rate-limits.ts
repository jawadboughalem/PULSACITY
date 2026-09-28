import type { RateLimitRule } from "@/lib/rate-limit/consume-rate-limit";

const FIFTEEN_MINUTES = 15 * 60;

export const MAGIC_LINKS_PER_ADDRESS: RateLimitRule = {
  name: "magic-link-address",
  limit: 3,
  windowSeconds: FIFTEEN_MINUTES,
};

export const MAGIC_LINK_REQUESTS_PER_IP: RateLimitRule = {
  name: "magic-link-ip",
  limit: 10,
  windowSeconds: FIFTEEN_MINUTES,
};
