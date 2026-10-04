import type { MetadataRoute } from "next";
import { readSiteUrl } from "@/lib/site-url";

/** The space, the collection pages of the creators' clients and the API stay out of search engines. */
const PRIVATE_PATHS = ["/app/", "/api/", "/t/", "/desinscription"];

const robots = (): MetadataRoute.Robots => {
  const siteUrl = readSiteUrl();
  // A preview is protected and never meant to be indexed.
  if (process.env.VERCEL_ENV === "preview") return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: PRIVATE_PATHS },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
};

export default robots;
