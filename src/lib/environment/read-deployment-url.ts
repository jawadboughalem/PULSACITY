import { readRequiredEnvironmentVariable } from "./read-required-environment-variable";

const withoutTrailingSlash = (url: string) => url.replace(/\/+$/, "");

/**
 * The address the app answers on. A Vercel preview answers on its branch address, never on the
 * production one: its magic links, collection links and e-mails stay on the preview.
 */
export const readDeploymentUrl = (variable: "NEXT_PUBLIC_APP_URL" | "BETTER_AUTH_URL"): string => {
  const branchUrl = process.env.VERCEL_BRANCH_URL;
  if (process.env.VERCEL_ENV === "preview" && branchUrl) return `https://${withoutTrailingSlash(branchUrl)}`;
  return withoutTrailingSlash(readRequiredEnvironmentVariable(variable));
};

/** Every address a deployment can be opened on, for the origin check of Better Auth. */
export const readDeploymentOrigins = (): string[] =>
  [process.env.VERCEL_BRANCH_URL, process.env.VERCEL_URL]
    .filter((host): host is string => Boolean(host) && process.env.VERCEL_ENV === "preview")
    .map((host) => `https://${withoutTrailingSlash(host)}`);
