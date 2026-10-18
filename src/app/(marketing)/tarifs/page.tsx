import { ChoiceScope, ChoiceToggle } from "@/components/marketing/ChoiceScope";
import { FaqList } from "@/components/marketing/FaqList";
import { JsonLd } from "@/components/marketing/JsonLd";
import { MARKETING_PATHS } from "@/components/marketing/marketing-paths";
import { MarketingSection, SectionTitle } from "@/components/marketing/MarketingSection";
import { PlanColumns } from "@/components/marketing/pricing/PlanColumns";
import { PlanComparison } from "@/components/marketing/pricing/PlanComparison";
import { PulsacityBadge } from "@/components/marketing/PulsacityTestimonials";
import { PLAN_IDS, PLANS } from "@/config/plans";
import { BILLING_FAQ } from "@/content/faq";
import { RECOMMENDED_PLAN, YEARLY_FREE_MONTHS, readPlanPrice } from "@/content/plan-offer";
import { readShownPriceList } from "@/lib/billing/read-shown-price-list";
import { formatPrice } from "@/lib/french/format-price";
import { buildPageMetadata } from "@/lib/seo/page-metadata";
import { buildFaqPageData } from "@/lib/seo/structured-data";
import { readPulsacityShowcase } from "@/lib/widgets/read-pulsacity-showcase";

/** Rebuilt every hour, and at once when the hundredth founder seat is taken (lib/billing/revalidate-shown-prices.ts). */
export const revalidate = 3600;

export const generateMetadata = async () => {
  const essentielPrice = formatPrice(readPlanPrice("essentiel", "monthly", await readShownPriceList()), "EUR");
  return buildPageMetadata({
    title: "Tarifs",
    description: `Commencez gratuitement. Essentiel à ${essentielPrice} par mois, Pro pour retirer la mention PULSACITY. Prix finaux, sans engagement, ${YEARLY_FREE_MONTHS} mois offerts à l'année.`,
    path: MARKETING_PATHS.pricing,
  });
};

const BILLING_OPTIONS = [
  { value: "monthly", label: "Mensuel" },
  { value: "yearly", label: "Annuel" },
];

const PLAN_OPTIONS = PLAN_IDS.map((id) => ({ value: id, label: PLANS[id].name }));

/** Maquette 8, Tarifs. */
const PricingPage = async () => {
  const [priceList, showcase] = await Promise.all([readShownPriceList(), readPulsacityShowcase()]);
  return (
    <>
      <JsonLd data={buildFaqPageData(BILLING_FAQ)} />

      <ChoiceScope initial="monthly" className="group/billing">
        <MarketingSection labelledBy="pricing-title" className="pb-10 desktop:pb-10">
          <div className="flex flex-col gap-8 desktop:flex-row desktop:items-start desktop:justify-between">
            <div className="flex flex-col gap-4 desktop:max-w-[720px]">
              <h1 id="pricing-title" className="font-display text-h1">
                Un prix simple, qui suit vos ventes.
              </h1>
              <p className="text-body text-gray desktop:max-w-[680px]">
                Commencez gratuitement. Passez à Essentiel quand les avis arrivent. Sans engagement. Prix finaux : rien
                ne s&apos;ajoute au paiement.
              </p>
            </div>
            <div className="flex flex-col gap-3 desktop:mt-8 desktop:items-end">
              <ChoiceToggle
                label="Période de paiement"
                options={BILLING_OPTIONS}
                announcements={{ monthly: "Prix mensuels affichés.", yearly: "Prix annuels affichés." }}
                className="w-full desktop:w-auto"
              />
              <p className="text-small font-bold">{`Annuel : ${YEARLY_FREE_MONTHS} mois offerts`}</p>
            </div>
          </div>
          <div className="mt-8 desktop:mt-10">
            <PlanColumns priceList={priceList} />
          </div>
        </MarketingSection>
      </ChoiceScope>

      <div className="px-page-gutter">
        <div className="mx-auto flex max-w-content flex-col gap-6 desktop:pt-6">
          <p className="text-small text-gray">Sans engagement · Changez de plan à tout moment · Paiement par carte</p>
          {showcase.badgeWidgetId !== null ? <PulsacityBadge widgetId={showcase.badgeWidgetId} /> : null}
        </div>
      </div>

      <MarketingSection labelledBy="compare-title">
        <SectionTitle id="compare-title">Comparer en détail</SectionTitle>
        <ChoiceScope initial={RECOMMENDED_PLAN} className="group/compare mt-6 desktop:mt-8">
          <ChoiceToggle
            label="Plan à comparer"
            options={PLAN_OPTIONS}
            announcements={Object.fromEntries(PLAN_IDS.map((id) => [id, `Plan ${PLANS[id].name} affiché.`]))}
            className="desktop:hidden"
          />
          <PlanComparison />
        </ChoiceScope>
      </MarketingSection>

      <MarketingSection labelledBy="billing-title" className="pt-[0] desktop:pt-[0]">
        <div className="grid gap-8 desktop:grid-cols-[448px_1fr]">
          <SectionTitle id="billing-title">Facturation</SectionTitle>
          <FaqList name="billing-faq" entries={BILLING_FAQ} surface="cloud" />
        </div>
      </MarketingSection>
    </>
  );
};

export default PricingPage;
