import { FinalCall } from "@/components/marketing/FinalCall";
import { IntegrationRows } from "@/components/marketing/integrations/IntegrationRows";
import { MeanwhileList } from "@/components/marketing/integrations/MeanwhileList";
import { PublicSuggestTool } from "@/components/marketing/integrations/PublicSuggestTool";
import { MARKETING_PATHS } from "@/components/marketing/marketing-paths";
import { MarketingSection, SectionTitle } from "@/components/marketing/MarketingSection";
import { WITHOUT_CONNECTOR } from "@/content/integrations/meanwhile";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

export const generateMetadata = () =>
  buildPageMetadata({
    title: "Intégrations : Systeme.io, Stripe, Calendly",
    description:
      "PULSACITY se branche sur l'outil où vous vendez. Systeme.io dès aujourd'hui, Stripe et Calendly bientôt : chaque vente devient une demande d'avis à votre nom.",
    path: MARKETING_PATHS.integrations,
  });

/** Maquette 21, « Intégrations »: the connectors, what works without one, then the call of m7. */
const IntegrationsPage = () => (
  <>
    <MarketingSection labelledBy="integrations-title">
      <div className="grid gap-6 desktop:grid-cols-[448px_minmax(0,1fr)] desktop:gap-6">
        <div className="flex flex-col gap-4">
          <h1 id="integrations-title" className="font-serif text-display font-medium tracking-title">
            Intégrations
          </h1>
          <p className="font-serif text-quote">
            PULSACITY se branche sur l&apos;outil où vous vendez. Chaque vente déclenche une demande d&apos;avis, à
            votre nom.
          </p>
        </div>
        <IntegrationRows isDetailed />
      </div>
    </MarketingSection>

    <MarketingSection labelledBy="without-connector-title" tone="paper">
      <div className="flex flex-col gap-4">
        <SectionTitle id="without-connector-title">Votre outil n&apos;est pas encore là ?</SectionTitle>
        <p className="max-w-text text-body text-slate-600">
          PULSACITY fonctionne aussi sans connecteur. Vous recueillez les avis, puis vous les affichez là où vous vendez.
        </p>
      </div>
      <div className="mt-6 desktop:mt-7">
        <MeanwhileList items={WITHOUT_CONNECTOR} layout="columns" />
      </div>
      <div className="mt-6 desktop:mt-7">
        <PublicSuggestTool />
      </div>
    </MarketingSection>

    <FinalCall
      title="Vos clients ont déjà quelque chose à dire."
      text="Deux minutes pour connecter Systeme.io, et la prochaine vente fait le reste."
    />
  </>
);

export default IntegrationsPage;
