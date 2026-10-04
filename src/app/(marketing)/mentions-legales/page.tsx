import { LegalPage } from "@/components/marketing/legal/LegalPage";
import { MARKETING_PATHS } from "@/components/marketing/marketing-paths";
import LegalText from "@/content/legal/mentions-legales.mdx";
import { isLegalValidated } from "@/lib/legal/is-legal-validated";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

export const generateMetadata = () =>
  buildPageMetadata({
    title: "Mentions légales",
    description: "Éditeur, hébergement et contact du site pulsacity.com et du service PULSACITY.",
    path: MARKETING_PATHS.legalNotice,
    isIndexed: isLegalValidated(),
  });

const LegalNoticePage = () => (
  <LegalPage title="Mentions légales" updatedOn="4 octobre 2026">
    <LegalText />
  </LegalPage>
);

export default LegalNoticePage;
