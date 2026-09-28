import { createHmac } from "node:crypto";
import { readRequiredEnvironmentVariable } from "@/lib/environment/read-required-environment-variable";

export const hashRateLimitSubject = (subject: string): string =>
  createHmac("sha256", readRequiredEnvironmentVariable("BETTER_AUTH_SECRET"))
    .update(subject.trim().toLowerCase())
    .digest("base64url");
