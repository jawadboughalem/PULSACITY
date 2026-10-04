import { FinalCall } from "@/components/marketing/FinalCall";
import { IntegrationRows } from "@/components/marketing/integrations/IntegrationRows";
import { MeanwhileList } from "@/components/marketing/integrations/MeanwhileList";
import { MARKETING_PATHS } from "@/components/marketing/marketing-paths";
import { MarketingSection, SectionTitle } from "@/components/marketing/MarketingSection";
import { MEANWHILE } from "@/content/integrations/meanwhile";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

export const generateMetadata = () =>
  buildPageMetadata({
    title: "Connecteurs : Systeme.io, Stripe, Calendly",
    description:
      "PULSACITY se branche sur l'outil où vous encaissez. Systeme.io dès aujourd'hui, Stripe et Calendly bientôt : chaque vente devient une demande d'avis à votre nom.",
    path: MARKETING_PATHS.integrations,
  });

/** No maquette of its own: the words and the rows of m7, « Connecteurs ». */
const IntegrationsPage = () => (
  <>
    <MarketingSection labelledBy="integrations-title">
      <div className="grid gap-7 desktop:grid-cols-[448px_1fr] desktop:gap-6">
        <div className="flex flex-col gap-4">
          <h1 id="integrations-title" className="font-serif text-display font-medium tracking-title">
            Connecteurs
          </h1>
          <p className="font-serif text-quote">
            Là où vous vendez déjà. Chaque vente devient une demande d&apos;avis, au bon moment, à votre nom.
          </p>
        </div>
        <IntegrationRows showsSummary />
      </div>
    </MarketingSection>

    <MarketingSection labelledBy="meanwhile-title" tone="paper">
      <SectionTitle id="meanwhile-title">Votre outil n&apos;est pas encore là ?</SectionTitle>
      <p className="mt-4 max-w-text text-body text-slate-600">
        PULSACITY marche déjà avec toutes vos ventes, quel que soit l&apos;outil où vous encaissez.
      </p>
      <MeanwhileList items={MEANWHILE} />
    </MarketingSection>

    <FinalCall
      title="Vos clients ont déjà quelque chose à dire."
      text="Deux minutes pour connecter Systeme.io, et la prochaine vente fait le reste."
    />
  </>
);

export default IntegrationsPage;
