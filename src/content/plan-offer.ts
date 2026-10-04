import { type Limit, PLAN_IDS, PLANS, type Plan, type PlanId, UNLIMITED } from "@/config/plans";
import { NO_BREAK_SPACE, quoteInFrench } from "@/lib/french/typography";

/**
 * What the public site says of each plan: maquettes 7 (prices in short) and 8 (Tarifs). Every number comes from
 * src/config/plans.ts, never from here.
 */

export type BillingPeriod = "monthly" | "yearly";

export const BILLING_PERIODS: BillingPeriod[] = ["monthly", "yearly"];

export const POWERED_BY_MENTION = `Mention ${quoteInFrench("Propulsé par PULSACITY")}`;

/** « Annuel : 2 mois offerts »: the year of the paid plans costs ten months, rounded down (decision_tarifs.md). */
export const countFreeMonths = (plan: Plan): number =>
  plan.priceCents.monthly === 0 ? 0 : Math.round(12 - plan.priceCents.yearly / plan.priceCents.monthly);

/** The free months of the paid plans, the same for all of them. */
export const YEARLY_FREE_MONTHS = countFreeMonths(PLANS.essentiel);

const plural = (count: number, singular: string, pluralForm: string) => (count === 1 ? singular : pluralForm);

const describeLimit = (limit: Limit, unlimited: string, limited: (count: number) => string) =>
  limit === UNLIMITED ? unlimited : limited(limit);

type PlanPresentation = {
  id: PlanId;
  name: string;
  tagline: string;
  highlights: string[];
  isRecommended: boolean;
};

const describeHighlights = (plan: Plan): string[] => {
  if (plan.badgeRemovable) return [`Tout ${PLANS.essentiel.name}`, "Mention PULSACITY retirable", "Témoignages vidéo, bientôt"];
  const testimonials = describeLimit(plan.limits.testimonials, "Témoignages illimités", (count) =>
    `${count} ${plural(count, "témoignage", "témoignages")}`,
  );
  const widgets = describeLimit(plan.limits.widgets, "Tous les widgets", (count) => `${count} ${plural(count, "widget", "widgets")}`);
  const requests = describeLimit(
    plan.limits.monthlyRequests,
    "Demandes automatiques illimitées",
    (count) => `${count} ${plural(count, "demande automatique", "demandes automatiques")} par mois`,
  );
  // m8: the free plan lists its limits, then the mention it shows; a paid plan puts the requests second.
  return plan.priceCents.monthly === 0
    ? [testimonials, widgets, requests, POWERED_BY_MENTION]
    : [testimonials, requests, widgets];
};

const TAGLINES: Record<PlanId, string> = {
  free: "Pour recueillir vos premiers avis.",
  essentiel: "Pour une activité qui vend chaque semaine.",
  pro: "Pour une marque qui soigne chaque détail.",
};

export const RECOMMENDED_PLAN: PlanId = "essentiel";

export const PLAN_PRESENTATIONS: PlanPresentation[] = PLAN_IDS.map((id) => ({
  id,
  name: PLANS[id].name,
  tagline: TAGLINES[id],
  highlights: describeHighlights(PLANS[id]),
  isRecommended: id === RECOMMENDED_PLAN,
}));

export type PriceParts = {
  /** « 9 », in the large figures. */
  whole: string;
  /** « ,99 € » or « € », smaller, on the same baseline (charte, m8), after a no-break space. */
  rest: string;
};

export const splitPrice = (amountCents: number): PriceParts => {
  const cents = amountCents % 100;
  return {
    whole: String(Math.floor(amountCents / 100)),
    rest: `${cents === 0 ? "" : `,${String(cents).padStart(2, "0")}`}${NO_BREAK_SPACE}€`,
  };
};

export const readPlanPrice = (id: PlanId, period: BillingPeriod): number => PLANS[id].priceCents[period];

/** « pour toujours », « par mois », « par an ». */
export const describePricePeriod = (id: PlanId, period: BillingPeriod): string => {
  if (readPlanPrice(id, period) === 0) return "pour toujours";
  return period === "monthly" ? "par mois" : "par an";
};

/** One value of the comparison: included, not included, to come, or a word. */
export type ComparisonValue =
  | { kind: "included" }
  | { kind: "excluded"; label: string }
  | { kind: "soon"; label: string }
  | { kind: "text"; label: string };

export type ComparisonRow = { label: string; values: Record<PlanId, ComparisonValue> };

export type ComparisonGroup = { title: string; rows: ComparisonRow[] };

const INCLUDED: ComparisonValue = { kind: "included" };

const everyPlan = (value: (plan: Plan) => ComparisonValue): Record<PlanId, ComparisonValue> => ({
  free: value(PLANS.free),
  essentiel: value(PLANS.essentiel),
  pro: value(PLANS.pro),
});

const allIncluded = everyPlan(() => INCLUDED);

const limitValue = (limit: Limit, unlimited: string, limited: (count: number) => string): ComparisonValue => ({
  kind: "text",
  label: describeLimit(limit, unlimited, limited),
});

/** « Comparer en détail » of maquette 8, row by row, as m8 on a phone shows it. */
export const PLAN_COMPARISON: ComparisonGroup[] = [
  {
    title: "Témoignages",
    rows: [
      {
        label: "Témoignages conservés et affichés",
        values: everyPlan((plan) => limitValue(plan.limits.testimonials, "Illimités", String)),
      },
      {
        label: "Demandes automatiques après une vente",
        values: everyPlan((plan) => limitValue(plan.limits.monthlyRequests, "Illimitées", (count) => `${count} par mois`)),
      },
      { label: "Une relance si pas de réponse", values: allIncluded },
      { label: "Lien de collecte à partager", values: allIncluded },
      { label: "Valider, corriger, masquer", values: allIncluded },
      { label: "Preuve de consentement horodatée", values: allIncluded },
    ],
  },
  {
    title: "Widgets",
    rows: [
      { label: "Nombre de widgets", values: everyPlan((plan) => limitValue(plan.limits.widgets, "Illimités", String)) },
      {
        label: "Mur, carrousel et badge",
        values: everyPlan((plan) =>
          plan.limits.widgets === UNLIMITED ? INCLUDED : { kind: "text", label: `${plan.limits.widgets} au choix` },
        ),
      },
      { label: "Tri par offre", values: allIncluded },
      { label: "Couleur et thème de votre page", values: allIncluded },
      {
        label: POWERED_BY_MENTION,
        values: everyPlan((plan) => ({ kind: "text", label: plan.badgeRemovable ? "Retirable" : "Affichée" })),
      },
    ],
  },
  {
    title: "Connecteurs",
    rows: [
      { label: "Systeme.io", values: allIncluded },
      { label: "Stripe et Calendly, dès leur sortie", values: allIncluded },
    ],
  },
  {
    title: "Bientôt",
    rows: [
      {
        label: "Témoignages vidéo",
        values: everyPlan((plan) =>
          plan.badgeRemovable ? { kind: "soon", label: "Bientôt" } : { kind: "excluded", label: "Non inclus" },
        ),
      },
    ],
  },
];
