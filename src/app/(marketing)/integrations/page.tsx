import { CallToAction } from "@/components/marketing/CallToAction";
import { IntegrationCatalog } from "@/components/marketing/integrations/IntegrationCatalog";
import { PublicSuggestTool } from "@/components/marketing/integrations/PublicSuggestTool";
import { SiteCompatibility } from "@/components/marketing/integrations/SiteCompatibility";
import { WithoutConnectorCards } from "@/components/marketing/integrations/WithoutConnectorCards";
import { MARKETING_PATHS } from "@/components/marketing/marketing-paths";
import { MarketingSection } from "@/components/marketing/MarketingSection";
import { SITE_GROUP_TITLE_CLASSES, SITE_PAGE_TITLE_CLASSES } from "@/components/marketing/marketing-styles";
import { WITHOUT_CONNECTOR } from "@/content/integrations/meanwhile";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

export const generateMetadata = () =>
  buildPageMetadata({
    title: "Intégrations : Systeme.io, Zapier, Make, Stripe et plus",
    description:
      "Systeme.io, et tous vos outils avec Zapier, Make ou n8n : chaque vente devient une demande d'avis à votre nom. Stripe, Calendly, Learnybox et d'autres arrivent.",
    path: MARKETING_PATHS.integrations,
    socialTitle: "Intégrations",
  });

/** The anchor of « Compatible avec votre site »: the home's « Votre site est-il compatible ? » leads here. */
const COMPATIBILITY_ID = "compatible";

/**
 * Maquettes 3.5, Intégrations, on Nuage: the catalog of 3.3 in six families with its filter, « Dites-nous quel outil »,
 * what works without a connector, the sites where the widget pastes, then « Créer mon espace gratuit ».
 */
const IntegrationsPage = () => (
  <MarketingSection labelledBy="integrations-title" tone="cloud" className="desktop:pt-12">
    <div className="flex flex-col gap-3">
      <h1 id="integrations-title" className={SITE_PAGE_TITLE_CLASSES}>
        Intégrations
      </h1>
      <p className="max-w-[820px] text-lead">
        Reliez l&apos;outil où vous vendez : chaque vente déclenche une demande d&apos;avis à votre nom.
      </p>
      <p className="max-w-text text-body text-gray">
        Vous collez une adresse dans votre outil, une fois. Ensuite, chaque vente arrive toute seule.
      </p>
    </div>
    <div className="mt-8">
      <IntegrationCatalog
        after={
          <>
            <PublicSuggestTool />
            <section aria-labelledby="without-connector-title" className="flex flex-col gap-5">
              <h2 id="without-connector-title" className={SITE_GROUP_TITLE_CLASSES}>
                Sans connecteur, ça marche déjà
              </h2>
              <WithoutConnectorCards items={WITHOUT_CONNECTOR} />
            </section>
            <section id={COMPATIBILITY_ID} aria-labelledby="compatibility-title" className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <h2 id="compatibility-title" className={SITE_GROUP_TITLE_CLASSES}>
                  Compatible avec votre site
                </h2>
                <p className="max-w-[740px] text-body text-gray">
                  Le widget se colle sur toute page qui accepte un bloc de code HTML. Voici ce que nous avons vérifié,
                  outil par outil. Cette liste parle de votre page de vente ; les connecteurs, plus haut, parlent de
                  l&apos;outil où vous vendez.
                </p>
              </div>
              <SiteCompatibility />
            </section>
            <CallToAction place="integrations" isMentionBeside />
          </>
        }
      />
    </div>
  </MarketingSection>
);

export default IntegrationsPage;
