import Link from "next/link";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { ConnectorLogo } from "@/components/connectors/ConnectorLogo";
import { CheckList } from "@/components/marketing/CheckList";
import { FaqList } from "@/components/marketing/FaqList";
import { FinalCall } from "@/components/marketing/FinalCall";
import { InstallGuide } from "@/components/marketing/integrations/InstallGuide";
import { IntegrationBadge } from "@/components/marketing/integrations/IntegrationRows";
import { MeanwhileList } from "@/components/marketing/integrations/MeanwhileList";
import { PublicWaitlistForm } from "@/components/marketing/integrations/PublicWaitlistForm";
import { JsonLd } from "@/components/marketing/JsonLd";
import { MARKETING_PATHS, guidePath, integrationPath } from "@/components/marketing/marketing-paths";
import { MarketingSection, SectionTitle } from "@/components/marketing/MarketingSection";
import { LARGE_BUTTON_CLASSES, TEXT_LINK_CLASSES } from "@/components/marketing/marketing-styles";
import { findGuide } from "@/content/guides";
import { type AvailableIntegration, INTEGRATIONS, type UpcomingIntegration, findIntegration } from "@/content/integrations";
import { buildPageMetadata } from "@/lib/seo/page-metadata";
import { buildFaqPageData } from "@/lib/seo/structured-data";

export const dynamicParams = false;

export const generateStaticParams = () => INTEGRATIONS.map((integration) => ({ connector: integration.slug }));

export const generateMetadata = async ({ params }: PageProps<"/integrations/[connector]">) => {
  const integration = findIntegration((await params).connector);
  if (!integration) return {};
  return buildPageMetadata({
    title: integration.seo.title,
    description: integration.seo.description,
    path: integrationPath(integration.slug),
  });
};

const Breadcrumb = ({ name }: { name: string }) => (
  <nav aria-label="Fil d'Ariane" className="text-small">
    <ol className="flex items-center gap-2">
      <li>
        <Link href={MARKETING_PATHS.integrations} className={TEXT_LINK_CLASSES}>
          Connecteurs
        </Link>
      </li>
      <li aria-hidden="true" className="text-slate-600">
        ›
      </li>
      <li aria-current="page" className="text-slate-600">
        {name}
      </li>
    </ol>
  </nav>
);

const Hero = ({ integration, children }: { integration: AvailableIntegration | UpcomingIntegration; children: ReactNode }) => (
  <MarketingSection labelledBy="integration-title" className="desktop:pt-7">
    <Breadcrumb name={integration.name} />
    <div className="mt-6 flex flex-col gap-5 desktop:mt-7 desktop:max-w-[760px]">
      <div className="flex items-center gap-4">
        <ConnectorLogo name={integration.name} />
        <IntegrationBadge integration={integration} />
      </div>
      <h1 id="integration-title" className="font-serif text-display font-medium tracking-title">
        {integration.heading}
      </h1>
      <p className="font-serif text-quote">{integration.intro}</p>
    </div>
    {children}
  </MarketingSection>
);

const AvailablePage = ({ integration }: { integration: AvailableIntegration }) => {
  const guide = findGuide(integration.relatedGuide);
  return (
    <>
      <JsonLd data={buildFaqPageData(integration.faq)} />
      <Hero integration={integration}>
        <div className="mt-6 flex flex-col items-center gap-4 desktop:flex-row desktop:gap-5">
          <Link href={MARKETING_PATHS.signUp} className={LARGE_BUTTON_CLASSES}>
            Créer mon espace gratuit
          </Link>
          <a href="#installation" className={TEXT_LINK_CLASSES}>
            Voir le guide d&apos;installation
          </a>
        </div>
        <ul className="mt-8 grid gap-6 desktop:grid-cols-3 desktop:gap-7">
          {integration.benefits.map((benefit) => (
            <li key={benefit.title} className="flex flex-col gap-3 border-t border-ink-900 pt-5">
              <h2 className="font-serif text-quote font-medium">{benefit.title}</h2>
              <p className="text-body text-slate-600">{benefit.text}</p>
            </li>
          ))}
        </ul>
      </Hero>

      <MarketingSection id="installation" labelledBy="install-title" hasTopRule>
        <div className="flex flex-col gap-4">
          <SectionTitle id="install-title">{`Installer la connexion ${integration.name}, pas à pas`}</SectionTitle>
          <p className="max-w-text text-body text-slate-600">
            {`${integration.installSteps.length} étapes, une dizaine de minutes. Gardez cette page ouverte à côté de ${integration.name}.`}
          </p>
        </div>
        <div className="mt-6 desktop:mt-7">
          <InstallGuide integration={integration} />
        </div>
        <p className="mt-6 max-w-text text-body">{integration.afterInstall}</p>
        {guide ? (
          <p className="mt-4 text-body">
            {"Pour aller plus loin : "}
            <Link href={guidePath(guide.slug)} className={TEXT_LINK_CLASSES}>
              {guide.title}
            </Link>
          </p>
        ) : null}
      </MarketingSection>

      <MarketingSection labelledBy="integration-questions" tone="paper">
        <div className="grid gap-6 desktop:grid-cols-[448px_1fr]">
          <SectionTitle id="integration-questions">Vos questions</SectionTitle>
          <FaqList name="integration-faq" entries={integration.faq} />
        </div>
      </MarketingSection>

      <FinalCall
        title={`Votre prochaine vente ${integration.name} peut devenir un témoignage.`}
        text={`Créez votre espace, collez l'adresse dans ${integration.name} : le reste se fait seul.`}
      />
    </>
  );
};

const UpcomingPage = ({ integration }: { integration: UpcomingIntegration }) => (
  <>
    <Hero integration={integration}>
      <div className="mt-6 flex flex-col gap-4 desktop:mt-7">
        <h2 className="text-body font-semibold">{`Être prévenu à la sortie de ${integration.name}`}</h2>
        <PublicWaitlistForm connector={integration.connector} connectorName={integration.name} />
      </div>
    </Hero>

    <MarketingSection labelledBy="will-do-title" hasTopRule>
      <div className="grid gap-6 desktop:grid-cols-[448px_1fr]">
        <SectionTitle id="will-do-title">Ce que fera la connexion</SectionTitle>
        <CheckList items={integration.willDo} className="border-t border-ink-900 pt-5" />
      </div>
    </MarketingSection>

    <MarketingSection labelledBy="meanwhile-title" tone="paper">
      <SectionTitle id="meanwhile-title">En attendant, sans connecteur</SectionTitle>
      <p className="mt-4 max-w-text text-body text-slate-600">
        {`Vos clients ${integration.name} peuvent déjà recevoir une demande d'avis, dès aujourd'hui.`}
      </p>
      <MeanwhileList items={integration.meanwhile} />
    </MarketingSection>

    <FinalCall
      title="Vos clients ont déjà quelque chose à dire."
      text="Créez votre espace gratuit : votre lien de collecte et « Demander un avis » marchent dès le premier jour."
    />
  </>
);

/** One page per connector, generated from its content file (src/content/integrations). No maquette of its own. */
const IntegrationPage = async ({ params }: PageProps<"/integrations/[connector]">) => {
  const integration = findIntegration((await params).connector);
  if (!integration) notFound();
  return integration.status === "available" ? (
    <AvailablePage integration={integration} />
  ) : (
    <UpcomingPage integration={integration} />
  );
};

export default IntegrationPage;
