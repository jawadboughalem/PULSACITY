import { type HeardFrom, isHeardFrom } from "./heard-from";

/**
 * Where a visitor comes from, as the address says it (decisions/commercialisation.md, « Attribution »): the standard UTM
 * words, and the referral code of a badge « Propulsé par » or of a referral link. The source travels in the address
 * only, from the page of arrival to the sign-up, through the sign-in link, until the space is created; nothing is
 * kept on the device.
 */
export const SOURCE_PARAMETERS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "ref"] as const;

export type SourceParameter = (typeof SOURCE_PARAMETERS)[number];

export type SignupSource = Partial<Record<SourceParameter, string>>;

/** The answer to « Comment avez-vous connu PULSACITY ? » travels with the source from the sign-up, under this word. */
export const HEARD_FROM_PARAMETER = "connu";

export const MAX_SOURCE_VALUE_LENGTH = 100;

const REFERRAL_CODE_PATTERN = /^[a-z0-9-]{3,40}$/;

// Control characters out, spaces collapsed: a value is read in a report, never run.
const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/g;

const cleanValue = (parameter: SourceParameter, raw: string): string | undefined => {
  const value = raw.replace(CONTROL_CHARACTERS, " ").replace(/\s+/g, " ").trim().slice(0, MAX_SOURCE_VALUE_LENGTH);
  if (value === "") return undefined;
  if (parameter === "ref") {
    const code = value.toLowerCase();
    return REFERRAL_CODE_PATTERN.test(code) ? code : undefined;
  }
  return value;
};

type ParameterSource = URLSearchParams | FormData | Record<string, string | string[] | undefined>;

const readRaw = (parameters: ParameterSource, name: string): string | null => {
  if (parameters instanceof URLSearchParams) return parameters.get(name);
  if (typeof FormData !== "undefined" && parameters instanceof FormData) {
    const value = parameters.get(name);
    return typeof value === "string" ? value : null;
  }
  const value = (parameters as Record<string, string | string[] | undefined>)[name];
  return (Array.isArray(value) ? value[0] : value) ?? null;
};

/** The source of an address, a form or a page's search parameters: unknown words and empty or odd values left out. */
export const readSignupSource = (parameters: ParameterSource): SignupSource => {
  const source: SignupSource = {};
  for (const parameter of SOURCE_PARAMETERS) {
    const raw = readRaw(parameters, parameter);
    const value = raw === null ? undefined : cleanValue(parameter, raw);
    if (value !== undefined) source[parameter] = value;
  }
  return source;
};

export const readHeardFrom = (parameters: ParameterSource): HeardFrom | null => {
  const raw = readRaw(parameters, HEARD_FROM_PARAMETER);
  return isHeardFrom(raw) ? raw : null;
};

export const hasSignupSource = (source: SignupSource): boolean => Object.keys(source).length > 0;

/** The address with the source added to its own search words (a source already there is replaced). */
export const withSignupSource = (path: string, source: SignupSource, heardFrom: HeardFrom | null = null): string => {
  if (!hasSignupSource(source) && heardFrom === null) return path;
  const [beforeHash, hash] = path.split("#", 2);
  const [pathname, search = ""] = beforeHash.split("?", 2);
  const parameters = new URLSearchParams(search);
  for (const parameter of SOURCE_PARAMETERS) {
    const value = source[parameter];
    if (value === undefined) parameters.delete(parameter);
    else parameters.set(parameter, value);
  }
  if (heardFrom !== null) parameters.set(HEARD_FROM_PARAMETER, heardFrom);
  return `${pathname}?${parameters.toString()}${hash === undefined ? "" : `#${hash}`}`;
};
