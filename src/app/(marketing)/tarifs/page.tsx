import { ChoiceScope, ChoiceToggle } from "@/components/marketing/ChoiceScope";
import { FaqList } from "@/components/marketing/FaqList";
import { JsonLd } from "@/components/marketing/JsonLd";
import { MARKETING_PATHS } from "@/components/marketing/marketing-paths";
import { MarketingSection, SectionTitle } from "@/components/marketing/MarketingSection";
import { PlanColumns } from "@/components/marketing/pricing/PlanColumns";
import { PlanComparison } from "@/components/marketing/pricing/PlanComparison";
import { PLAN_IDS, PLANS } from "@/config/plans";
import { BILLING_FAQ } from "@/content/faq";
import { RECOMMENDED_PLAN, YEARLY_FREE_MONTHS } from "@/content/plan-offer";
import { formatPrice } from "@/lib/french/format-price";
import { buildPageMetadata } from "@/lib/seo/page-metadata";
import { buildFaqPageData } from "@/lib/seo/structured-data";

const ESSENTIEL_PRICE = formatPrice(PLANS.essentiel.priceCents.monthly, "EUR");

export const generateMetadata = () =>
  buildPageMetadata({
    title: "Tarifs",
    description: `Commencez gratuitement. Essentiel à ${ESSENTIEL_PRICE} par mois, Pro pour retirer la mention PULSACITY. Sans engagement, TVA comprise, ${YEARLY_FREE_MONTHS} mois offerts à l'année.`,
    path: MARKETING_PATHS.pricing,
  });

const BILLING_OPTIONS = [
  { value: "monthly", label: "Mensuel" },
  { value: "yearly", label: "Annuel" },
];

const PLAN_OPTIONS = PLAN_IDS.map((id) => ({ value: id, label: PLANS[id].name }));

/** Maquette 8, Tarifs. */
const PricingPage = () => (
  <>
    <JsonLd data={buildFaqPageData(BILLING_FAQ)} />

    <ChoiceScope initial="monthly" className="group/billing">
      <MarketingSection labelledBy="pricing-title" className="pb-7 desktop:pb-7">
        <div className="flex flex-col gap-6 desktop:flex-row desktop:items-start desktop:justify-between">
          <div className="flex flex-col gap-4 desktop:max-w-[720px]">
            <h1 id="pricing-title" className="font-serif text-display font-medium tracking-title">
              Un prix simple, qui suit vos ventes.
            </h1>
            <p className="text-body text-slate-600 desktop:max-w-[680px]">
              Commencez gratuitement. Passez à Essentiel quand les avis arrivent. Sans engagement, TVA comprise.
            </p>
          </div>
          <div className="flex flex-col gap-3 desktop:mt-6 desktop:items-end">
            <ChoiceToggle
              label="Période de paiement"
              options={BILLING_OPTIONS}
              announcements={{ monthly: "Prix mensuels affichés.", yearly: "Prix annuels affichés." }}
              className="w-full desktop:w-auto"
            />
            <p className="text-small text-slate-600">{`Annuel : ${YEARLY_FREE_MONTHS} mois offerts`}</p>
          </div>
        </div>
        <div className="mt-6 desktop:mt-7">
          <PlanColumns />
        </div>
      </MarketingSection>
    </ChoiceScope>

    <div className="desktop:border-t desktop:border-hairline-200">
      <p className="mx-auto max-w-[1440px] px-page-gutter text-small text-slate-600 desktop:pt-5">
        Sans engagement · Changez de plan à tout moment · Paiement par carte
      </p>
    </div>

    <MarketingSection labelledBy="compare-title">
      <SectionTitle id="compare-title">Comparer en détail</SectionTitle>
      <ChoiceScope initial={RECOMMENDED_PLAN} className="group/compare mt-5 desktop:mt-6">
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
      <div className="grid gap-6 desktop:grid-cols-[448px_1fr]">
        <SectionTitle id="billing-title">Facturation</SectionTitle>
        <FaqList name="billing-faq" entries={BILLING_FAQ} />
      </div>
    </MarketingSection>
  </>
);

export default PricingPage;
