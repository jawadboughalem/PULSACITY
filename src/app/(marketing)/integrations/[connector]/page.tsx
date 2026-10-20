import Link from "next/link";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/marketing/Breadcrumb";
import { CallToAction } from "@/components/marketing/CallToAction";
import { FaqSectionContent } from "@/components/marketing/FaqList";
import { FinalCall, PAGE_FINAL_CALL_TITLE } from "@/components/marketing/FinalCall";
import { InstallGuide } from "@/components/marketing/integrations/InstallGuide";
import { IntegrationBadge } from "@/components/marketing/integrations/IntegrationBadge";
import { PublicWaitlistForm } from "@/components/marketing/integrations/PublicWaitlistForm";
import { JsonLd } from "@/components/marketing/JsonLd";
import { MARKETING_PATHS, guidePath, integrationPath } from "@/components/marketing/marketing-paths";
import { MarketingSection, SectionTitle, type SectionTone } from "@/components/marketing/MarketingSection";
import {
  SITE_LARGE_PAGE_TITLE_CLASSES,
  SITE_PANEL_TITLE_CLASSES,
  TEXT_LINK_CLASSES,
} from "@/components/marketing/marketing-styles";
import { INLINE_LINK_CLASSES, SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/Icon";
import type { IconName } from "@/components/ui/icon-paths";
import { Monogram } from "@/components/ui/Monogram";
import {
  type AvailableIntegration,
  INTEGRATIONS,
  type UpcomingIntegration,
  describeMeanwhile,
  findIntegration,
} from "@/content/integrations";
import { MEANWHILE } from "@/content/integrations/meanwhile";
import { cn } from "@/lib/cn";
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

/** The three points under the title of an available tool, each under its icon in a Ciel circle (maquettes 3.5). */
const BENEFIT_ICONS: IconName[] = ["connection", "clock", "valid"];

/** The guides of Zapier and Make: « En attendant : avec Zapier ou Make » (decisions/connecteurs.md). */
const ZAPIER_GUIDE = { href: guidePath("envoyer-vos-ventes-avec-zapier"), label: "Guide Zapier" };

const MAKE_GUIDE = { href: guidePath("envoyer-vos-ventes-avec-make"), label: "Guide Make" };

const Hero = ({ integration, children }: { integration: AvailableIntegration | UpcomingIntegration; children: ReactNode }) => (
  <MarketingSection labelledBy="integration-title" className="pt-6 desktop:pt-10">
    <Breadcrumb parent={{ href: MARKETING_PATHS.integrations, label: "Intégrations" }} current={integration.name} />
    <div className="mt-4 flex flex-col gap-5 desktop:gap-6">
      <div className="flex items-center gap-4">
        <Monogram name={integration.name} className="size-[56px] text-[21px]" />
        <IntegrationBadge integration={integration} />
      </div>
      <h1 id="integration-title" className={SITE_LARGE_PAGE_TITLE_CLASSES}>
        {integration.heading}
      </h1>
      <p className="max-w-[640px] text-lead">{integration.intro}</p>
    </div>
    {children}
  </MarketingSection>
);

type SplitSectionProps = {
  id: string;
  title: string;
  text: string;
  tone?: SectionTone;
  children: ReactNode;
};

/** A section of maquettes 3.5 in two columns: its title and a sentence on the left, its content on the right. */
const SplitSection = ({ id, title, text, tone, children }: SplitSectionProps) => (
  <MarketingSection labelledBy={id} tone={tone}>
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6 desktop:grid-cols-[400px_minmax(0,1fr)] desktop:gap-10">
      <div className="flex flex-col gap-4">
        <SectionTitle id={id}>{title}</SectionTitle>
        <p className="text-body text-gray">{text}</p>
      </div>
      <div>{children}</div>
    </div>
  </MarketingSection>
);

const AvailablePage = ({ integration }: { integration: AvailableIntegration }) => (
  <>
    <JsonLd data={buildFaqPageData(integration.faq)} />
    <Hero integration={integration}>
      <CallToAction
        place="integration"
        className="mt-8"
        link={
          <Link href="#installation" className={TEXT_LINK_CLASSES}>
            Voir le guide d&apos;installation
          </Link>
        }
      />
      <ul className="mt-12 grid gap-8 desktop:mt-14 desktop:grid-cols-3 desktop:gap-10">
        {integration.benefits.map((benefit, index) => (
          <li key={benefit.title} className="flex flex-col gap-3">
            <span className="flex size-[48px] items-center justify-center rounded-full bg-sky">
              <Icon name={BENEFIT_ICONS[index % BENEFIT_ICONS.length]} size={24} />
            </span>
            <h2 className="font-display text-h3">{benefit.title}</h2>
            <p className="text-body text-gray">{benefit.text}</p>
          </li>
        ))}
      </ul>
    </Hero>

    <MarketingSection id="installation" labelledBy="install-title" tone="cloud">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-8 desktop:grid-cols-[392px_minmax(0,1fr)] desktop:gap-10">
        {/* On a computer, the title and the help stay in view while the steps are read (maquettes 3.5). */}
        <div className="flex flex-col gap-4 desktop:sticky desktop:top-[112px] desktop:self-start">
          <h2 id="install-title" className={SITE_PANEL_TITLE_CLASSES}>
            {integration.installTitle ?? `Installer la connexion ${integration.name}, pas à pas`}
          </h2>
          <p className="text-body text-gray">{integration.installIntro}</p>
          <p className="mt-2 rounded-card bg-sky p-6 text-body">
            {"Un souci à une étape ? "}
            <Link href={MARKETING_PATHS.contact} className={cn(INLINE_LINK_CLASSES, "font-bold")}>
              Écrivez-nous
            </Link>
            {" : nous faisons la connexion avec vous, en partage d'écran."}
          </p>
        </div>
        <InstallGuide integration={integration} />
      </div>
    </MarketingSection>

    <MarketingSection labelledBy="integration-questions">
      <FaqSectionContent
        titleId="integration-questions"
        title="Vos questions"
        name="integration-faq"
        entries={integration.faq}
        surface="cloud"
      />
    </MarketingSection>

    <FinalCall
      tone="cloud"
      title={PAGE_FINAL_CALL_TITLE}
      text={integration.finalCall ?? `Connectez ${integration.name} une fois : chaque vente suivante fait le reste.`}
    />
  </>
);

/** « En attendant » of a tool to come: its title, and the guides that already send its sales to PULSACITY. */
const readMeanwhileGuides = (integration: UpcomingIntegration) => {
  const meanwhile = describeMeanwhile(integration);
  switch (integration.meanwhileVia ?? "zapier-or-make") {
    case "zapier-or-make":
      return { title: "En attendant : avec Zapier ou Make", text: meanwhile.item.text, guides: [ZAPIER_GUIDE, MAKE_GUIDE] };
    case "zapier":
      return {
        title: "En attendant : avec Zapier",
        text: meanwhile.item.text,
        guides: meanwhile.item.link ? [{ href: meanwhile.item.link.href, label: `Guide ${integration.name}` }] : [ZAPIER_GUIDE],
      };
    case "universal":
      return {
        title: "En attendant : avec le connecteur universel",
        text: meanwhile.item.text,
        guides: meanwhile.item.link ? [{ href: meanwhile.item.link.href, label: meanwhile.item.link.label }] : [],
      };
  }
};

const UpcomingPage = ({ integration }: { integration: UpcomingIntegration }) => {
  const meanwhile = readMeanwhileGuides(integration);
  return (
    <>
      <Hero integration={integration}>
        <div className="mt-8">
          <PublicWaitlistForm connector={integration.connector} connectorName={integration.name} />
        </div>
      </Hero>

      <SplitSection
        id="will-do-title"
        title="Ce que fera la connexion"
        text="Une fois installée, plus rien à faire : chaque vente arrive toute seule."
        tone="cloud"
      >
        <ul className="flex flex-col gap-2">
          {integration.willDo.map((item) => (
            <li key={item} className="flex items-start gap-3 rounded-card bg-white px-5 py-4 text-body">
              <Icon name="check" size={20} className="mt-[3px] shrink-0 text-success" />
              {item}
            </li>
          ))}
        </ul>
      </SplitSection>

      <MarketingSection labelledBy="meanwhile-title">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-6 desktop:grid-cols-[400px_minmax(0,1fr)] desktop:gap-10">
          <SectionTitle id="meanwhile-title">{meanwhile.title}</SectionTitle>
          <div className="flex flex-col gap-5">
            <p className="max-w-text text-body">{meanwhile.text}</p>
            <div className="flex flex-col gap-3 desktop:flex-row">
              {meanwhile.guides.map((guide) => (
                <Link key={guide.href} href={guide.href} className={cn(SECONDARY_BUTTON_CLASSES, "w-full desktop:w-auto")}>
                  <Icon name="file" size={20} />
                  {guide.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </MarketingSection>

      <SplitSection
        id="without-tool-title"
        title="Ou, sans aucun outil"
        text={`${
          integration.meanwhileVia === "universal" ? "Vos clients" : `Vos clients ${integration.name}`
        } peuvent déjà laisser un avis. Tout ceci est inclus dans le plan Gratuit.`}
        tone="cloud"
      >
        <ul className="flex flex-col gap-2">
          {MEANWHILE.map((item) => (
            <li key={item.title} className="flex flex-col gap-1 rounded-card bg-white px-5 py-4">
              <h3 className="text-body font-bold">{item.title}</h3>
              <p className="text-small text-gray">{item.text}</p>
            </li>
          ))}
        </ul>
        <CallToAction place="integration-en-attendant" className="mt-6" />
      </SplitSection>
    </>
  );
};

/** Maquettes 3.5: one page per connector, generated from its content file (src/content/integrations). */
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
