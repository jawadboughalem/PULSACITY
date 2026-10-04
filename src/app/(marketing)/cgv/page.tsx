import { LegalPage } from "@/components/marketing/legal/LegalPage";
import { MARKETING_PATHS } from "@/components/marketing/marketing-paths";
import LegalText from "@/content/legal/cgv.mdx";
import { isLegalValidated } from "@/lib/legal/is-legal-validated";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

export const generateMetadata = () =>
  buildPageMetadata({
    title: "Conditions générales de vente",
    description: "Prix, paiement, renouvellement et résiliation des abonnements Essentiel et Pro de PULSACITY.",
    path: MARKETING_PATHS.salesTerms,
    isIndexed: isLegalValidated(),
  });

const SalesTermsPage = () => (
  <LegalPage name="cgv" title="Conditions générales de vente" updatedOn="4 octobre 2026">
    <LegalText />
  </LegalPage>
);

export default SalesTermsPage;
