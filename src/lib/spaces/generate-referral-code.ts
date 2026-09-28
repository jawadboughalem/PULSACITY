import { randomInt } from "node:crypto";

const REFERRAL_CODE_ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789";
const REFERRAL_CODE_LENGTH = 8;

export const generateReferralCode = (): string =>
  Array.from({ length: REFERRAL_CODE_LENGTH }, () => REFERRAL_CODE_ALPHABET[randomInt(REFERRAL_CODE_ALPHABET.length)]).join(
    "",
  );
