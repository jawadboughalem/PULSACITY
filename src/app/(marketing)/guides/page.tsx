import { FinalCall } from "@/components/marketing/FinalCall";
import { GuideList } from "@/components/marketing/guides/GuideList";
import { MARKETING_PATHS } from "@/components/marketing/marketing-paths";
import { MarketingSection } from "@/components/marketing/MarketingSection";
import { GUIDES } from "@/content/guides";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

export const generateMetadata = () =>
  buildPageMetadata({
    title: "Guides : récolter et afficher les témoignages de vos clients",
    description:
      "Des guides concrets pour les formateurs, coachs et consultants : récolter des témoignages, les afficher sur Systeme.io, respecter le RGPD.",
    path: MARKETING_PATHS.guides,
  });

/** No maquette of its own: the title of m7 and rows like its connectors. */
const GuidesPage = () => (
  <>
    <MarketingSection labelledBy="guides-title">
      <div className="grid gap-7 desktop:grid-cols-[448px_1fr] desktop:gap-6">
        <div className="flex flex-col gap-4">
          <h1 id="guides-title" className="font-serif text-display font-medium tracking-title">
            Guides
          </h1>
          <p className="font-serif text-quote">
            Récolter les avis de vos clients, les afficher, et le faire dans les règles.
          </p>
        </div>
        <GuideList guides={GUIDES} />
      </div>
    </MarketingSection>
    <FinalCall
      title="Vos clients ont déjà quelque chose à dire."
      text="Deux minutes pour connecter Systeme.io, et la prochaine vente fait le reste."
    />
  </>
);

export default GuidesPage;
