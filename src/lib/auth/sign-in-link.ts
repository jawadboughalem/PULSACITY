import { SIGN_IN_PATH } from "@/lib/auth/require-signed-in-user";
import { ONBOARDING_SPACE_STEP_PATH, SPACE_HOME_PATH } from "@/lib/spaces/space-paths";

/** Maquettes 3.6, « Votre lien »: the link in clear shows no technical word, /entrer/{code}. */
export const SIGN_IN_LINK_PATH = "/entrer";

const VERIFY_PATH = "/api/auth/magic-link/verify";

/**
 * Better Auth's link, /api/auth/magic-link/verify?token=…&callbackURL=…, becomes /entrer/{token}, followed by the
 * source of a sign-up when there is one (lot 4.12). Only the links of /connexion and /inscription take this form: their
 * destinations are fixed, so the address need not carry them. Any other link stays as Better Auth wrote it.
 */
export const shortenSignInLink = (url: string): string => {
  const link = new URL(url);
  const token = link.searchParams.get("token");
  const newUserCallback = link.searchParams.get("newUserCallbackURL");
  if (
    !token ||
    link.pathname !== VERIFY_PATH ||
    link.searchParams.get("callbackURL") !== SPACE_HOME_PATH ||
    link.searchParams.get("errorCallbackURL") !== SIGN_IN_PATH ||
    !newUserCallback
  ) {
    return url;
  }
  const onboarding = new URL(newUserCallback, link.origin);
  if (onboarding.origin !== link.origin || onboarding.pathname !== ONBOARDING_SPACE_STEP_PATH) return url;
  return `${link.origin}${SIGN_IN_LINK_PATH}/${encodeURIComponent(token)}${onboarding.search}`;
};

/** /entrer/{token}?… back to Better Auth's link, with the destinations of /connexion. */
export const expandSignInLink = (origin: string, token: string, search: string): string => {
  const verify = new URL(VERIFY_PATH, origin);
  verify.searchParams.set("token", token);
  verify.searchParams.set("callbackURL", SPACE_HOME_PATH);
  verify.searchParams.set("newUserCallbackURL", `${ONBOARDING_SPACE_STEP_PATH}${search}`);
  verify.searchParams.set("errorCallbackURL", SIGN_IN_PATH);
  return verify.toString();
};
