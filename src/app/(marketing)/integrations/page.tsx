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
    title: "Intégrations : Systeme.io, Zapier, Make, Stripe et plus",
    description:
      "Systeme.io, et tous vos outils avec Zapier, Make ou n8n : chaque vente devient une demande d'avis à votre nom. Stripe, Calendly, Learnybox et d'autres arrivent.",
    path: MARKETING_PATHS.integrations,
  });

/** Maquette 21, « Intégrations »: the connectors, what works without one, then the call of m7. */
const IntegrationsPage = () => (
  <>
    <MarketingSection labelledBy="integrations-title">
      <div className="grid gap-8 desktop:grid-cols-[448px_minmax(0,1fr)] desktop:gap-8">
        <div className="flex flex-col gap-4">
          <h1 id="integrations-title" className="font-display text-h1">
            Intégrations
          </h1>
          <p className="text-lead">
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
        <p className="max-w-text text-body text-gray">
          Le connecteur universel reçoit ses ventes par Zapier, Make ou n8n. Et sans rien relier, vous recueillez déjà des
          avis.
        </p>
      </div>
      <div className="mt-8 desktop:mt-10">
        <MeanwhileList items={WITHOUT_CONNECTOR} layout="columns" />
      </div>
      <div className="mt-8 desktop:mt-10">
        <PublicSuggestTool />
      </div>
    </MarketingSection>

    <FinalCall
      title="Vos clients ont déjà quelque chose à dire."
      text="Reliez l'outil où vous vendez : la prochaine vente fait le reste."
    />
  </>
);

export default IntegrationsPage;
