const PRODUCTION_URL = "https://pulsacity.com";

/**
 * The address of the public site, for canonical links, the sitemap and social images. Unlike getAppUrl, it never
 * throws: the marketing pages are built without any environment variable (CI). A preview answers on its branch.
 */
export const readSiteUrl = (): string => {
  const branchUrl = process.env.VERCEL_BRANCH_URL;
  if (process.env.VERCEL_ENV === "preview" && branchUrl) return `https://${branchUrl.replace(/\/+$/, "")}`;
  return (process.env.NEXT_PUBLIC_APP_URL || PRODUCTION_URL).replace(/\/+$/, "");
};

