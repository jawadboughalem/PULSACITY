import type { Metadata } from "next";

export const SITE_NAME = "PULSACITY";

type PageMetadataInput = {
  /** The page's own title, without the site name: « · PULSACITY » follows, as on every page of the app. */
  title: string;
  description: string;
  /** The page's address on the site, for its canonical link and Open Graph. */
  path: string;
  /** The title of the social image, when it differs from the page's. */
  socialTitle?: string;
  /** Drafts and pages without value for search engines. */
  isIndexed?: boolean;
};

/**
 * Title, description, canonical address and Open Graph of a public page. The social image comes from the nearest
 * opengraph-image file of the route: it is not set here, so that the page's own Open Graph does not hide it.
 */
export const buildPageMetadata = ({
  title,
  description,
  path,
  socialTitle = title,
  isIndexed = true,
}: PageMetadataInput): Metadata => ({
  title: `${title} · ${SITE_NAME}`,
  description,
  alternates: { canonical: path },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: SITE_NAME,
    title: socialTitle,
    description,
    url: path,
  },
  twitter: { card: "summary_large_image", title: socialTitle, description },
  robots: isIndexed ? undefined : { index: false, follow: true },
});
