import { LegalPage } from "@/components/marketing/legal/LegalPage";
import { MARKETING_PATHS } from "@/components/marketing/marketing-paths";
import LegalText from "@/content/legal/cgu.mdx";
import { isLegalValidated } from "@/lib/legal/is-legal-validated";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

export const generateMetadata = () =>
  buildPageMetadata({
    title: "Conditions générales d'utilisation",
    description: "Les règles d'utilisation de PULSACITY, et l'accord de sous-traitance des données des clients des créateurs.",
    path: MARKETING_PATHS.terms,
    isIndexed: isLegalValidated(),
  });

const TermsPage = () => (
  <LegalPage name="cgu" title="Conditions générales d'utilisation" updatedOn="4 octobre 2026">
    <LegalText />
  </LegalPage>
);

export default TermsPage;
