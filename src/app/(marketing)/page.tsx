import Link from "next/link";
import { FaqList } from "@/components/marketing/FaqList";
import { FinalCall } from "@/components/marketing/FinalCall";
import { PlanSummary } from "@/components/marketing/home/PlanSummary";
import { SaleToWallDemo } from "@/components/marketing/home/SaleToWallDemo";
import { WidgetShowcase } from "@/components/marketing/home/WidgetShowcase";
import { IntegrationRows } from "@/components/marketing/integrations/IntegrationRows";
import { JsonLd } from "@/components/marketing/JsonLd";
import { MARKETING_PATHS, integrationPath } from "@/components/marketing/marketing-paths";
import { MarketingSection, SectionTitle } from "@/components/marketing/MarketingSection";
import { LARGE_BUTTON_CLASSES, TEXT_LINK_CLASSES } from "@/components/marketing/marketing-styles";
import { Icon } from "@/components/ui/Icon";
import { HOME_FAQ } from "@/content/faq";
import { SYSTEME_IO } from "@/content/integrations/systeme-io";
import { cn } from "@/lib/cn";
import { buildPageMetadata } from "@/lib/seo/page-metadata";
import { buildFaqPageData, buildOrganizationData } from "@/lib/seo/structured-data";
import { readSiteUrl } from "@/lib/site-url";

export const generateMetadata = () =>
  buildPageMetadata({
    title: "Vos ventes deviennent des témoignages, automatiquement",
    description:
      "Après chaque vente sur Systeme.io, votre client reçoit une demande d'avis à votre nom. Vous validez, et son témoignage s'affiche sur votre page de vente. Gratuit pour commencer.",
    path: MARKETING_PATHS.home,
  });

const HOW_IT_WORKS = [
  {
    title: "Connectez Systeme.io",
    text: "Une adresse et une clé à coller dans vos paramètres Systeme.io. Deux minutes, sans rien installer.",
  },
  {
    title: "Vos clients reçoivent une demande",
    text: "Un e-⁠mail à votre nom, au moment que vous choisissez pour chaque offre. Une seule relance, jamais plus.",
  },
  {
    title: "Vous validez, votre page s'enrichit",
    text: "Vous relisez chaque avis. Validé, il apparaît dans le widget collé une fois pour toutes sur votre page.",
  },
];

/** Maquette 7, pulsacity.com. */
const HomePage = () => (
  <>
    <JsonLd data={buildOrganizationData(readSiteUrl())} />
    <JsonLd data={buildFaqPageData(HOME_FAQ)} />

    <MarketingSection labelledBy="hero-title">
      <div className="flex flex-col gap-5 desktop:max-w-[720px]">
        <h1 id="hero-title" className="font-serif text-display font-medium tracking-title">
          Vos ventes deviennent des témoignages, automatiquement.
        </h1>
        <p className="font-serif text-quote desktop:max-w-[660px]">
          Après chaque vente sur Systeme.io, votre client reçoit une demande d&apos;avis à votre nom. Vous validez, et son
          témoignage s&apos;affiche sur votre page de vente.
        </p>
      </div>
      <div className="mt-6 flex flex-col items-center gap-5 desktop:flex-row desktop:gap-5">
        <Link href={MARKETING_PATHS.signUp} className={LARGE_BUTTON_CLASSES}>
          Créer mon espace gratuit
        </Link>
        <Link
          href={integrationPath(SYSTEME_IO.slug)}
          className="inline-flex min-h-[44px] items-center gap-2 text-body hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900"
        >
          <Icon name="valid" size={20} className="text-success" />
          Compatible avec Systeme.io
        </Link>
      </div>
      <div className="mt-8">
        <SaleToWallDemo />
      </div>
    </MarketingSection>

    <MarketingSection id="fonctionnement" labelledBy="how-it-works" hasTopRule>
      <SectionTitle id="how-it-works">Comment ça marche</SectionTitle>
      <ol className="mt-6 grid gap-6 desktop:mt-7 desktop:grid-cols-3 desktop:gap-7">
        {HOW_IT_WORKS.map((step, index) => (
          <li key={step.title} className="flex flex-col gap-3 border-t border-ink-900 pt-5">
            <span aria-hidden="true" className="font-serif text-h1">
              {index + 1}
            </span>
            <h3 className="font-serif text-quote font-medium">{step.title}</h3>
            <p className="text-body text-slate-600">{step.text}</p>
          </li>
        ))}
      </ol>
    </MarketingSection>

    <MarketingSection tone="paper" labelledBy="your-colours">
      <SectionTitle id="your-colours">Chez vous, avec vos couleurs</SectionTitle>
      <p className="mt-4 max-w-[760px] text-body text-slate-600">
        Le widget reprend la police et la couleur de votre page. Ici, la page de vente de Julie Nutrition, coach à Lyon.
      </p>
      <div className="mt-6 desktop:mt-7">
        <WidgetShowcase />
      </div>
    </MarketingSection>

    <MarketingSection labelledBy="connectors">
      <div className="grid gap-6 desktop:grid-cols-[448px_1fr]">
        <div className="flex flex-col gap-4">
          <SectionTitle id="connectors">Connecteurs</SectionTitle>
          <p className="text-body text-slate-600">Là où vous vendez déjà. D&apos;autres outils arrivent.</p>
        </div>
        <IntegrationRows />
      </div>
    </MarketingSection>

    <MarketingSection labelledBy="prices" hasTopRule>
      <div className="flex flex-col gap-2 desktop:flex-row desktop:items-baseline desktop:justify-between">
        <SectionTitle id="prices">Tarifs</SectionTitle>
        <Link href={MARKETING_PATHS.pricing} className={cn(TEXT_LINK_CLASSES, "hidden desktop:inline-flex")}>
          Voir le détail des tarifs
        </Link>
      </div>
      <div className="mt-6 desktop:mt-7">
        <PlanSummary />
      </div>
      <Link href={MARKETING_PATHS.pricing} className={cn(TEXT_LINK_CLASSES, "mt-6 desktop:hidden")}>
        Voir le détail des tarifs
      </Link>
    </MarketingSection>

    <MarketingSection id="questions" tone="paper" labelledBy="your-questions">
      <div className="grid gap-6 desktop:grid-cols-[448px_1fr]">
        <SectionTitle id="your-questions">Vos questions</SectionTitle>
        <FaqList name="home-faq" entries={HOME_FAQ} />
      </div>
    </MarketingSection>

    <FinalCall
      title="Vos clients ont déjà quelque chose à dire."
      text="Deux minutes pour connecter Systeme.io, et la prochaine vente fait le reste."
    />
  </>
);

export default HomePage;
