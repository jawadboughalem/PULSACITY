import { AboutReviewsArticle } from "@/components/marketing/about-reviews/AboutReviewsArticle";
import { MARKETING_PATHS } from "@/components/marketing/marketing-paths";
import { isLegalValidated } from "@/lib/legal/is-legal-validated";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

/** Read by a lawyer with the CGV before it is indexed (positionnement.md, point 8): like the legal texts. */
export const generateMetadata = () =>
  buildPageMetadata({
    title: "À propos de ces avis",
    description:
      "Comment les avis affichés avec PULSACITY sont recueillis, datés et affichés : provenance, contrepartie, modification, ordre d'affichage, motifs de refus.",
    path: MARKETING_PATHS.aboutReviews,
    isIndexed: isLegalValidated(),
  });

const AboutReviewsPage = () => <AboutReviewsArticle />;

export default AboutReviewsPage;
