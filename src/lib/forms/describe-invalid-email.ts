const EXAMPLE_DOMAIN = "gmail.com";

/**
 * What is missing in a typed address, with the address completed as an example: « Il manque la fin de l'adresse, par
 * exemple julie@example.com. » (m20, m21). Null when the address is neither of these two cases.
 */
export const describeMissingEmailPart = (typed: string): string | null => {
  const [local = "", domain = "", ...rest] = typed.split("@");
  if (!typed.includes("@") && /^[^\s@]+$/.test(typed)) {
    return `Il manque le « @ » de l'adresse, par exemple ${typed}@${EXAMPLE_DOMAIN}.`;
  }
  if (rest.length === 0 && local && domain && /^[^\s@.]+$/.test(domain)) {
    return `Il manque la fin de l'adresse, par exemple ${local}@${domain}.com.`;
  }
  return null;
};
