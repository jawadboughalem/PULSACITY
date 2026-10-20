import Link from "next/link";
import { CallToAction } from "@/components/marketing/CallToAction";
import { ExampleMention } from "@/components/marketing/ExampleMention";
import { FaqSectionContent } from "@/components/marketing/FaqList";
import { FinalCall } from "@/components/marketing/FinalCall";
import { FirstCreators } from "@/components/marketing/home/FirstCreators";
import { HeroExample } from "@/components/marketing/home/HeroExample";
import {
  HomeCatalog,
  HomeCatalogLinks,
  ProofList,
  RightMoments,
  SurveyFigure,
  ToolsBandContent,
} from "@/components/marketing/home/HomeSections";
import { PlanSummary } from "@/components/marketing/home/PlanSummary";
import { SaleToWallDemo } from "@/components/marketing/home/SaleToWallDemo";
import { HERO_CALL_ID, StickyCallBar } from "@/components/marketing/home/StickyCallBar";
import { TestReviewDemo } from "@/components/marketing/home/TestReviewDemo";
import { WidgetShowcase } from "@/components/marketing/home/WidgetShowcase";
import { JsonLd } from "@/components/marketing/JsonLd";
import { MARKETING_PATHS } from "@/components/marketing/marketing-paths";
import { MarketingSection, SectionTitle } from "@/components/marketing/MarketingSection";
import { SITE_HERO_TITLE_CLASSES, TEXT_LINK_CLASSES } from "@/components/marketing/marketing-styles";
import { PulsacityWall } from "@/components/marketing/PulsacityTestimonials";
import { HOME_FAQ } from "@/content/faq";
import { HOME_TITLE } from "@/content/home-title";
import { describeHomePricesTitle } from "@/content/plan-offer";
import { readShownPriceList } from "@/lib/billing/read-shown-price-list";
import { cn } from "@/lib/cn";
import { buildPageMetadata } from "@/lib/seo/page-metadata";
import { buildFaqPageData, buildOrganizationData } from "@/lib/seo/structured-data";
import { readSiteUrl } from "@/lib/site-url";
import { readPulsacityShowcase } from "@/lib/widgets/read-pulsacity-showcase";

/** positionnement.md, Référencement: the title and the description of the home page. */
export const generateMetadata = () =>
  buildPageMetadata({
    title: "Récoltez des témoignages clients automatiquement",
    description:
      "Après chaque vente, PULSACITY demande l'avis de votre client à votre nom et affiche son témoignage sur votre page de vente. Gratuit, sans carte bancaire.",
    path: MARKETING_PATHS.home,
    socialTitle: HOME_TITLE,
  });

/**
 * Rebuilt every hour, and at once when the hundredth founder seat is taken (lib/billing/revalidate-shown-prices.ts).
 * PULSACITY's own wall appears at the first rebuild after its fifth validated testimonial.
 */
export const revalidate = 3600;

/** The space between a section's title and what follows it. */
const AFTER_TITLE = "mt-4 desktop:mt-6";

/** Maquettes 3.5, Accueil: the twelve sections of positionnement.md, in their order, and the phone's fixed bar. */
const HomePage = async () => {
  const [priceList, showcase] = await Promise.all([readShownPriceList(), readPulsacityShowcase()]);
  return (
    <>
      <JsonLd data={buildOrganizationData(readSiteUrl())} />
      <JsonLd data={buildFaqPageData(HOME_FAQ)} />

      {/* 1. En-tête */}
      <MarketingSection labelledBy="hero-title" className="pt-8 desktop:pt-13">
        <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-10 desktop:grid-cols-[minmax(0,1fr)_520px] desktop:gap-14">
          <div className="flex flex-col gap-6 desktop:max-w-[640px]">
            <h1 id="hero-title" className={SITE_HERO_TITLE_CLASSES}>
              {HOME_TITLE}
            </h1>
            <p className="text-lead">
              Après chaque vente, votre client reçoit un e-⁠mail à votre nom qui lui demande son avis, au bon moment. Vous
              validez, et les témoignages de vos clients s&apos;affichent sur votre page de vente.
            </p>
            <div id={HERO_CALL_ID}>
              <CallToAction
                place="accueil"
                mention="Gratuit, sans carte bancaire. Vous payez le prix affiché. Données hébergées dans l'Union européenne."
                link={
                  <Link href="#fonctionnement" className={TEXT_LINK_CLASSES}>
                    Voir comment ça marche
                  </Link>
                }
              />
            </div>
          </div>
          <HeroExample />
        </div>
      </MarketingSection>

      {/* 2. Bande des outils */}
      <MarketingSection labelledBy="tools-title" tone="sky" className="desktop:pt-11 desktop:pb-12">
        <SectionTitle id="tools-title">Fonctionne avec l&apos;outil où vous encaissez</SectionTitle>
        <div className={AFTER_TITLE}>
          <ToolsBandContent />
        </div>
      </MarketingSection>

      {/* 3. Le problème */}
      <MarketingSection labelledBy="problem-title" tone="cloud">
        <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-8 desktop:grid-cols-[minmax(0,1fr)_548px] desktop:gap-13">
          <div className="flex flex-col gap-4 desktop:gap-6">
            <SectionTitle id="problem-title">Vos clients sont contents. Votre page de vente ne le dit pas.</SectionTitle>
            <p className="max-w-[660px] text-lead">
              Demander un témoignage, c&apos;est un message de plus à écrire, au bon moment, à chaque client. On oublie.
              On n&apos;ose pas relancer. Et ceux qu&apos;on reçoit dorment dans une boîte de réception ou une capture
              d&apos;écran.
            </p>
          </div>
          <SurveyFigure />
        </div>
      </MarketingSection>

      {/* 4. Démo en quatre temps, et l'avis de test */}
      <MarketingSection id="fonctionnement" labelledBy="how-it-works">
        <SectionTitle id="how-it-works">De la vente au témoignage, sans y penser</SectionTitle>
        <div className={cn(AFTER_TITLE, "flex flex-col gap-6")}>
          <SaleToWallDemo />
          <ExampleMention />
          <TestReviewDemo />
        </div>
      </MarketingSection>

      {/* 5. Widget réel */}
      <MarketingSection labelledBy="your-colours" tone="cloud">
        <SectionTitle id="your-colours">Il prend les couleurs de votre page</SectionTitle>
        <p className={cn(AFTER_TITLE, "max-w-[740px] text-body")}>
          Un mur, un carrousel ou un badge. Le widget reprend vos polices et vos couleurs. Il est léger : votre page reste
          rapide, et rien ne bouge pendant le chargement. Vous collez son code une seule fois ; les nouveaux témoignages
          apparaissent d&apos;eux-mêmes.
        </p>
        <div className="mt-6">
          <WidgetShowcase />
        </div>
        <div className="mt-6 flex flex-col items-start gap-2">
          <p className="text-body">Se colle sur Systeme.io, WordPress, Wix, Squarespace, Webflow et Carrd, selon votre formule.</p>
          <Link href={`${MARKETING_PATHS.integrations}#compatible`} className={cn(TEXT_LINK_CLASSES, "-ml-[10px] text-small")}>
            Votre site est-il compatible ?
          </Link>
        </div>
        <CallToAction place="accueil-widget" className="mt-6" />
      </MarketingSection>

      {/* 6. Le bon moment pour chaque offre */}
      <MarketingSection labelledBy="right-moment">
        <SectionTitle id="right-moment">Le bon moment pour chaque offre</SectionTitle>
        <p className={cn(AFTER_TITLE, "max-w-[760px] text-lead")}>
          Une formation ne se juge pas comme une séance. Pour chaque offre, vous choisissez quand part la demande.
        </p>
        <div className="mt-6">
          <RightMoments />
        </div>
      </MarketingSection>

      {/* 7. Catalogue des connecteurs */}
      <MarketingSection labelledBy="connectors" tone="cloud">
        <SectionTitle id="connectors">Reliez l&apos;outil où vous encaissez</SectionTitle>
        <p className={cn(AFTER_TITLE, "max-w-[820px] text-lead")}>
          Vous collez une adresse dans votre outil, une fois. Ensuite, chaque vente arrive toute seule.
        </p>
        <div className="mt-6 flex flex-col gap-8">
          <HomeCatalog />
          <HomeCatalogLinks />
        </div>
      </MarketingSection>

      {/* 8. Vrais clients */}
      <MarketingSection labelledBy="real-customers">
        <SectionTitle id="real-customers">Des avis de vrais clients, et la preuve qui va avec</SectionTitle>
        <div className={AFTER_TITLE}>
          <ProofList />
        </div>
      </MarketingSection>

      {/* 9. Tarifs */}
      <MarketingSection labelledBy="prices" tone="cloud">
        <SectionTitle id="prices">{describeHomePricesTitle(priceList)}</SectionTitle>
        <p className={cn(AFTER_TITLE, "text-lead")}>
          Commencez gratuitement, sans carte bancaire. Prix finaux : vous payez le prix affiché.
        </p>
        <div className="mt-6">
          <PlanSummary priceList={priceList} />
        </div>
        <CallToAction
          place="accueil-tarifs"
          className="mt-6"
          linkOnPhone="after-mention"
          link={
            <Link href={MARKETING_PATHS.pricing} className={TEXT_LINK_CLASSES}>
              Voir les tarifs
            </Link>
          }
        />
      </MarketingSection>

      {/* 10. Les premiers créateurs: their real wall once PULSACITY has enough reviews, the beta's offer until then. */}
      {showcase.wallWidgetId !== null ? (
        <PulsacityWall widgetId={showcase.wallWidgetId} />
      ) : (
        <MarketingSection labelledBy="first-creators">
          <FirstCreators />
        </MarketingSection>
      )}

      {/* 11. Questions */}
      <MarketingSection id="questions" labelledBy="your-questions" tone="cloud">
        <FaqSectionContent titleId="your-questions" title="Vos questions" name="home-faq" entries={HOME_FAQ} surface="white" />
      </MarketingSection>

      {/* 12. Appel final */}
      <FinalCall
        isHome
        title="Votre prochaine vente peut devenir votre prochain témoignage"
        text="Créez votre espace, reliez votre outil, collez le widget. Les demandes partent toutes seules."
      />

      <StickyCallBar />
    </>
  );
};

export default HomePage;
