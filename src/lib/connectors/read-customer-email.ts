import { z } from "zod";
import { InvalidPayloadError } from "./invalid-payload-error";

/** The customer's address, in lowercase. Systeme.io accepts accented addresses: so does PULSACITY. */
export const readCustomerEmail = (value: string): string => {
  const email = value.trim().toLowerCase();
  if (!z.email({ pattern: z.regexes.unicodeEmail }).safeParse(email).success) {
    throw new InvalidPayloadError("The e-mail address is not valid.");
  }
  return email;
};
