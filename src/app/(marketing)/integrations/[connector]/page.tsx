import Link from "next/link";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { ConnectorLogo } from "@/components/connectors/ConnectorLogo";
import { RuledCheckList } from "@/components/marketing/CheckList";
import { FaqList } from "@/components/marketing/FaqList";
import { FinalCall } from "@/components/marketing/FinalCall";
import { InstallGuide } from "@/components/marketing/integrations/InstallGuide";
import { IntegrationBadge } from "@/components/marketing/integrations/IntegrationRows";
import { MeanwhileList } from "@/components/marketing/integrations/MeanwhileList";
import { PublicWaitlistForm } from "@/components/marketing/integrations/PublicWaitlistForm";
import { JsonLd } from "@/components/marketing/JsonLd";
import { MARKETING_PATHS, integrationPath } from "@/components/marketing/marketing-paths";
import { MarketingSection, SectionTitle } from "@/components/marketing/MarketingSection";
import { LARGE_BUTTON_CLASSES, TEXT_LINK_CLASSES } from "@/components/marketing/marketing-styles";
import { Icon } from "@/components/ui/Icon";
import {
  type AvailableIntegration,
  INTEGRATIONS,
  type UpcomingIntegration,
  findIntegration,
} from "@/content/integrations";
import { MEANWHILE } from "@/content/integrations/meanwhile";
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

/** The connector the others are compared to: « Elle fonctionnera comme celle de Systeme.io ». */
const AVAILABLE_NAME = INTEGRATIONS.find((integration) => integration.status === "available")?.name ?? "Systeme.io";

const Breadcrumb = ({ name }: { name: string }) => (
  <nav aria-label="Fil d'Ariane" className="text-small">
    <ol className="flex items-center gap-3">
      <li>
        <Link href={MARKETING_PATHS.integrations} className={TEXT_LINK_CLASSES}>
          Intégrations
        </Link>
      </li>
      <li aria-hidden="true" className="flex text-slate-600">
        <Icon name="chevronRight" size={16} />
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
    <div className="mt-4 flex flex-col gap-5 desktop:max-w-[760px]">
      <div className="flex items-center gap-4">
        <ConnectorLogo name={integration.name} />
        <IntegrationBadge integration={integration} />
      </div>
      <h1 id="integration-title" className="font-serif text-display font-medium tracking-title">
        {integration.heading}
      </h1>
      <p className="max-w-[656px] font-serif text-quote">{integration.intro}</p>
    </div>
    {children}
  </MarketingSection>
);

/** A section of m21 in two columns: its title and a sentence on the left, its content on the right. */
const SplitSection = ({
  id,
  title,
  text,
  tone,
  hasTopRule,
  children,
}: {
  id: string;
  title: string;
  text: string;
  tone?: "white" | "paper";
  hasTopRule?: boolean;
  children: ReactNode;
}) => (
  <MarketingSection labelledBy={id} tone={tone} hasTopRule={hasTopRule}>
    <div className="grid gap-6 desktop:grid-cols-[448px_minmax(0,1fr)] desktop:gap-6">
      <div className="flex flex-col gap-4 desktop:pr-7">
        <SectionTitle id={id}>{title}</SectionTitle>
        <p className="text-body text-slate-600">{text}</p>
      </div>
      <div>{children}</div>
    </div>
  </MarketingSection>
);

const AvailablePage = ({ integration }: { integration: AvailableIntegration }) => (
  <>
    <JsonLd data={buildFaqPageData(integration.faq)} />
    <Hero integration={integration}>
      <div className="mt-6 flex flex-col items-center gap-4 desktop:flex-row desktop:gap-6">
        <Link href={MARKETING_PATHS.signUp} className={LARGE_BUTTON_CLASSES}>
          Créer mon espace gratuit
        </Link>
        <a href="#installation" className={TEXT_LINK_CLASSES}>
          Voir le guide d&apos;installation
        </a>
      </div>
      <ul className="mt-8 grid gap-6 desktop:grid-cols-3 desktop:gap-7">
        {integration.benefits.map((benefit) => (
          <li key={benefit.title} className="flex flex-col gap-3 border-t border-ink-900 pt-5 desktop:pt-6">
            <h2 className="font-serif text-quote font-medium">{benefit.title}</h2>
            <p className="text-body text-slate-600">{benefit.text}</p>
          </li>
        ))}
      </ul>
    </Hero>

    <MarketingSection id="installation" labelledBy="install-title" hasTopRule>
      <div className="grid gap-6 desktop:grid-cols-[392px_minmax(0,1fr)] desktop:gap-7">
        <div className="flex flex-col gap-4">
          <SectionTitle id="install-title">{`Installer la connexion ${integration.name}, pas à pas`}</SectionTitle>
          <p className="text-body text-slate-600">{integration.installIntro}</p>
        </div>
        <InstallGuide integration={integration} />
      </div>
    </MarketingSection>

    <MarketingSection labelledBy="integration-questions" tone="paper">
      <div className="grid gap-6 desktop:grid-cols-[448px_minmax(0,1fr)]">
        <SectionTitle id="integration-questions">Vos questions</SectionTitle>
        <FaqList name="integration-faq" entries={integration.faq} />
      </div>
    </MarketingSection>

    <FinalCall
      title="Vos clients ont déjà quelque chose à dire."
      text={`Deux minutes pour connecter ${integration.name}, et la prochaine vente fait le reste.`}
    />
  </>
);

const UpcomingPage = ({ integration }: { integration: UpcomingIntegration }) => (
  <>
    <Hero integration={integration}>
      <div className="mt-6 desktop:mt-7">
        <PublicWaitlistForm connector={integration.connector} connectorName={integration.name} />
      </div>
    </Hero>

    <SplitSection
      id="will-do-title"
      title="Ce que fera la connexion"
      text={`Elle fonctionnera comme celle de ${AVAILABLE_NAME} : rien à faire après l'installation.`}
      hasTopRule
    >
      <RuledCheckList items={integration.willDo} />
    </SplitSection>

    <SplitSection
      id="meanwhile-title"
      title="En attendant, sans connecteur"
      text={`Vos clients ${integration.name} peuvent déjà laisser un avis. Tout ceci est inclus dans le plan Gratuit.`}
      tone="paper"
    >
      <MeanwhileList items={MEANWHILE} layout="rows" />
      <Link href={MARKETING_PATHS.signUp} className={`${LARGE_BUTTON_CLASSES} mt-6 desktop:mt-6`}>
        Créer mon espace gratuit
      </Link>
    </SplitSection>
  </>
);

/** Maquette 21: one page per connector, generated from its content file (src/content/integrations). */
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
