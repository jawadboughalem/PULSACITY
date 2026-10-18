import Link from "next/link";
import { SignUpLink } from "@/components/acquisition/SignUpLink";
import { FaqList } from "@/components/marketing/FaqList";
import { FinalCall } from "@/components/marketing/FinalCall";
import { PlanSummary } from "@/components/marketing/home/PlanSummary";
import { SaleToWallDemo } from "@/components/marketing/home/SaleToWallDemo";
import { WidgetShowcase } from "@/components/marketing/home/WidgetShowcase";
import { IntegrationRows } from "@/components/marketing/integrations/IntegrationRows";
import { JsonLd } from "@/components/marketing/JsonLd";
import { MARKETING_PATHS } from "@/components/marketing/marketing-paths";
import { MarketingSection, SectionTitle } from "@/components/marketing/MarketingSection";
import { PulsacityWall } from "@/components/marketing/PulsacityTestimonials";
import { LARGE_BUTTON_CLASSES, TEXT_LINK_CLASSES } from "@/components/marketing/marketing-styles";
import { FOCUS_RING } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/Icon";
import { HOME_FAQ } from "@/content/faq";
import { FEATURED_INTEGRATIONS } from "@/content/integrations";
import { readShownPriceList } from "@/lib/billing/read-shown-price-list";
import { cn } from "@/lib/cn";
import { buildPageMetadata } from "@/lib/seo/page-metadata";
import { buildFaqPageData, buildOrganizationData } from "@/lib/seo/structured-data";
import { readSiteUrl } from "@/lib/site-url";
import { readPulsacityShowcase } from "@/lib/widgets/read-pulsacity-showcase";

export const generateMetadata = () =>
  buildPageMetadata({
    title: "Vos ventes deviennent des témoignages, automatiquement",
    description:
      "Après chaque vente, PULSACITY demande l'avis de votre client à votre nom et affiche son témoignage sur votre page de vente. Gratuit, sans carte bancaire.",
    path: MARKETING_PATHS.home,
  });

const HOW_IT_WORKS = [
  {
    title: "Reliez l'outil où vous vendez",
    text: "Une adresse à coller une fois dans votre outil de vente, Systeme.io par exemple. Rien à installer.",
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

/**
 * Rebuilt every hour, and at once when the hundredth founder seat is taken (lib/billing/revalidate-shown-prices.ts).
 * PULSACITY's own wall appears at the first rebuild after its fifth validated testimonial.
 */
export const revalidate = 3600;

/** Maquette 7, pulsacity.com. */
const HomePage = async () => {
  const [priceList, showcase] = await Promise.all([readShownPriceList(), readPulsacityShowcase()]);
  return (
    <>
      <JsonLd data={buildOrganizationData(readSiteUrl())} />
      <JsonLd data={buildFaqPageData(HOME_FAQ)} />

      <MarketingSection labelledBy="hero-title">
        <div className="flex flex-col gap-6 desktop:max-w-[720px]">
          {/* « automatiquement. » is wider than a 360 px phone in display: the phone takes h1, the computer display. */}
          <h1 id="hero-title" className="font-display text-h1 desktop:text-display">
            Vos ventes deviennent des témoignages, automatiquement.
          </h1>
          <p className="text-lead desktop:max-w-[660px]">
            Après chaque vente, votre client reçoit un e-⁠mail à votre nom qui lui demande son avis, au bon moment. Vous
            validez, et son témoignage s&apos;affiche sur votre page de vente.
          </p>
        </div>
        <div className="mt-8 flex flex-col items-center gap-6 desktop:flex-row desktop:gap-6">
          <SignUpLink place="accueil" className={LARGE_BUTTON_CLASSES}>Créer mon espace gratuit</SignUpLink>
          <Link
            href={MARKETING_PATHS.integrations}
            className={cn(
              "pz-couleur inline-flex min-h-[44px] items-center gap-2 text-body decoration-2 underline-offset-4 hover:underline",
              FOCUS_RING,
            )}
          >
            <Icon name="valid" size={20} className="text-success" />
            Fonctionne avec Systeme.io, Zapier et Make
          </Link>
        </div>
        <div className="mt-12">
          <SaleToWallDemo />
        </div>
      </MarketingSection>

      <MarketingSection id="fonctionnement" labelledBy="how-it-works">
        <SectionTitle id="how-it-works">Comment ça marche</SectionTitle>
        <ol className="mt-8 grid gap-8 desktop:mt-10 desktop:grid-cols-3 desktop:gap-10">
          {HOW_IT_WORKS.map((step, index) => (
            <li key={step.title} className="flex flex-col gap-3">
              <span aria-hidden="true" className="font-display text-h2">
                {index + 1}
              </span>
              <h3 className="font-display text-h3">{step.title}</h3>
              <p className="text-body text-gray">{step.text}</p>
            </li>
          ))}
        </ol>
      </MarketingSection>

      <MarketingSection tone="paper" labelledBy="your-colours">
        <SectionTitle id="your-colours">Chez vous, avec vos couleurs</SectionTitle>
        <p className="mt-4 max-w-[760px] text-body text-gray">
          Le widget reprend la police et la couleur de votre page. Ici, la page de vente de Julie Nutrition, coach à Lyon.
        </p>
        <div className="mt-8 desktop:mt-10">
          <WidgetShowcase />
        </div>
      </MarketingSection>

      <MarketingSection labelledBy="connectors">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-8 desktop:grid-cols-[448px_minmax(0,1fr)]">
          <div className="flex flex-col gap-4">
            <SectionTitle id="connectors">Connecteurs</SectionTitle>
            <p className="text-body text-gray">
              Là où vous vendez déjà, ou n&apos;importe quel outil avec Zapier, Make ou n8n.
            </p>
            <Link href={MARKETING_PATHS.integrations} className={cn(TEXT_LINK_CLASSES, "hidden self-start desktop:inline-flex")}>
              Voir toutes les intégrations
            </Link>
          </div>
          <IntegrationRows integrations={FEATURED_INTEGRATIONS} />
          <Link href={MARKETING_PATHS.integrations} className={cn(TEXT_LINK_CLASSES, "self-start desktop:hidden")}>
            Voir toutes les intégrations
          </Link>
        </div>
      </MarketingSection>

      <MarketingSection labelledBy="prices">
        <div className="flex flex-col gap-2 desktop:flex-row desktop:items-baseline desktop:justify-between">
          <SectionTitle id="prices">Tarifs</SectionTitle>
          <Link href={MARKETING_PATHS.pricing} className={cn(TEXT_LINK_CLASSES, "hidden desktop:inline-flex")}>
            Voir le détail des tarifs
          </Link>
        </div>
        <div className="mt-8 desktop:mt-10">
          <PlanSummary priceList={priceList} />
        </div>
        <Link href={MARKETING_PATHS.pricing} className={cn(TEXT_LINK_CLASSES, "mt-8 desktop:hidden")}>
          Voir le détail des tarifs
        </Link>
      </MarketingSection>

      {showcase.wallWidgetId !== null ? <PulsacityWall widgetId={showcase.wallWidgetId} /> : null}

      <MarketingSection id="questions" tone="paper" labelledBy="your-questions">
        <div className="grid gap-8 desktop:grid-cols-[448px_1fr]">
          <SectionTitle id="your-questions">Vos questions</SectionTitle>
          <FaqList name="home-faq" entries={HOME_FAQ} surface="white" />
        </div>
      </MarketingSection>

      <FinalCall
        title="Vos clients ont déjà quelque chose à dire."
        text="Reliez l'outil où vous vendez : la prochaine vente fait le reste."
      />
    </>
  );
};

export default HomePage;
