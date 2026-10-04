import { LegalPage } from "@/components/marketing/legal/LegalPage";
import { MARKETING_PATHS } from "@/components/marketing/marketing-paths";
import LegalText from "@/content/legal/confidentialite.mdx";
import { isLegalValidated } from "@/lib/legal/is-legal-validated";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

export const generateMetadata = () =>
  buildPageMetadata({
    title: "Politique de confidentialité",
    description: "Les données que PULSACITY traite, pourquoi, combien de temps, et vos droits. Cookies compris.",
    path: MARKETING_PATHS.privacy,
    isIndexed: isLegalValidated(),
  });

const PrivacyPage = () => (
  <LegalPage title="Politique de confidentialité" updatedOn="4 octobre 2026">
    <LegalText />
  </LegalPage>
);

export default PrivacyPage;
