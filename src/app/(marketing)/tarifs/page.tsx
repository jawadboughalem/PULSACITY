import { ChoiceScope, ChoiceToggle } from "@/components/marketing/ChoiceScope";
import { FaqSectionContent } from "@/components/marketing/FaqList";
import { JsonLd } from "@/components/marketing/JsonLd";
import { MARKETING_PATHS } from "@/components/marketing/marketing-paths";
import { MarketingSection, SectionTitle } from "@/components/marketing/MarketingSection";
import { SITE_LARGE_PAGE_TITLE_CLASSES } from "@/components/marketing/marketing-styles";
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

/** Maquettes 3.5, Tarifs: the plans and their period, the comparison, then « Facturation ». */
const PricingPage = async () => {
  const [priceList, showcase] = await Promise.all([readShownPriceList(), readPulsacityShowcase()]);
  return (
    <>
      <JsonLd data={buildFaqPageData(BILLING_FAQ)} />

      <ChoiceScope initial="monthly" className="group/billing">
        <MarketingSection labelledBy="pricing-title" tone="cloud" className="pb-8 desktop:pt-12 desktop:pb-10">
          <div className="flex flex-col gap-6 desktop:flex-row desktop:items-end desktop:justify-between desktop:gap-10">
            <div className="flex flex-col gap-4 desktop:max-w-[720px]">
              <h1 id="pricing-title" className={SITE_LARGE_PAGE_TITLE_CLASSES}>
                Un prix simple, qui suit vos ventes.
              </h1>
              <p className="text-lead">
                Commencez gratuitement. Passez à Essentiel quand les avis arrivent. Sans engagement.
              </p>
              <p className="text-lead font-bold">Prix finaux : rien ne s&apos;ajoute au paiement.</p>
            </div>
            <div className="flex flex-col gap-3 desktop:flex-row desktop:items-center desktop:gap-4">
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
          <div className="mt-8 flex flex-col items-start gap-6 desktop:items-center">
            <p className="text-small text-gray desktop:text-center">
              Sans engagement · Changez de plan à tout moment · Paiement par carte
            </p>
            {showcase.badgeWidgetId !== null ? <PulsacityBadge widgetId={showcase.badgeWidgetId} /> : null}
          </div>
        </MarketingSection>
      </ChoiceScope>

      <MarketingSection labelledBy="compare-title" tone="cloud" className="pt-6 desktop:pt-6">
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

      <MarketingSection labelledBy="billing-title">
        <FaqSectionContent titleId="billing-title" title="Facturation" name="billing-faq" entries={BILLING_FAQ} surface="cloud" />
      </MarketingSection>
    </>
  );
};

export default PricingPage;
