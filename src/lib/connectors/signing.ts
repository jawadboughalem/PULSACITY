import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

const SECRET_BYTES = 16;

/** Hexadecimal: letters and digits only, so it pastes into any platform's field. */
export const generateSigningSecret = (): string => randomBytes(SECRET_BYTES).toString("hex");

export const signHmacSha256Hex = (secret: string, body: Uint8Array): string =>
  createHmac("sha256", secret).update(body).digest("hex");

export const isHmacSha256HexValid = (secret: string, body: Uint8Array, signature: string): boolean => {
  const expected = Buffer.from(signHmacSha256Hex(secret, body), "utf8");
  const received = Buffer.from(signature.trim().toLowerCase(), "utf8");
  return expected.length === received.length && timingSafeEqual(expected, received);
};
