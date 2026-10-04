import { describe, expect, it } from "vitest";
import { PLAN_IDS, PLANS } from "@/config/plans";
import { NO_BREAK_SPACE } from "@/lib/french/typography";
import {
  PLAN_COMPARISON,
  PLAN_PRESENTATIONS,
  POWERED_BY_MENTION,
  YEARLY_FREE_MONTHS,
  countFreeMonths,
  describePricePeriod,
  splitPrice,
} from "./plan-offer";

const highlightsOf = (id: string) => PLAN_PRESENTATIONS.find((plan) => plan.id === id)?.highlights;

describe("POWERED_BY_MENTION", () => {
  it("quotes the mention the French way", () => {
    expect(POWERED_BY_MENTION).toBe(`Mention «${NO_BREAK_SPACE}Propulsé par PULSACITY${NO_BREAK_SPACE}»`);
  });
});

describe("PLAN_PRESENTATIONS", () => {
  it("says what maquette 8 says, from the limits of plans.ts", () => {
    expect(highlightsOf("free")).toEqual([
      "15 témoignages",
      "1 widget",
      "20 demandes automatiques par mois",
      POWERED_BY_MENTION,
    ]);
    expect(highlightsOf("essentiel")).toEqual([
      "Témoignages illimités",
      "Demandes automatiques illimitées",
      "Tous les widgets",
    ]);
    expect(highlightsOf("pro")).toEqual(["Tout Essentiel", "Mention PULSACITY retirable", "Témoignages vidéo, bientôt"]);
  });

  it("presents the three plans in their order, Essentiel recommended", () => {
    expect(PLAN_PRESENTATIONS.map((plan) => plan.id)).toEqual([...PLAN_IDS]);
    expect(PLAN_PRESENTATIONS.filter((plan) => plan.isRecommended).map((plan) => plan.id)).toEqual(["essentiel"]);
  });
});

describe("splitPrice", () => {
  it("puts the euros apart from the cents and the sign, as m8 draws them", () => {
    expect(splitPrice(999)).toEqual({ whole: "9", rest: `,99${NO_BREAK_SPACE}€` });
    expect(splitPrice(19900)).toEqual({ whole: "199", rest: `${NO_BREAK_SPACE}€` });
    expect(splitPrice(0)).toEqual({ whole: "0", rest: `${NO_BREAK_SPACE}€` });
    expect(splitPrice(1205)).toEqual({ whole: "12", rest: `,05${NO_BREAK_SPACE}€` });
  });
});

describe("describePricePeriod", () => {
  it("says « pour toujours » for the free plan, and the period otherwise", () => {
    expect(describePricePeriod("free", "monthly")).toBe("pour toujours");
    expect(describePricePeriod("free", "yearly")).toBe("pour toujours");
    expect(describePricePeriod("essentiel", "monthly")).toBe("par mois");
    expect(describePricePeriod("pro", "yearly")).toBe("par an");
  });
});

describe("countFreeMonths", () => {
  it("finds the two months offered by the year, on both paid plans", () => {
    expect(YEARLY_FREE_MONTHS).toBe(2);
    expect(countFreeMonths(PLANS.pro)).toBe(2);
    expect(countFreeMonths(PLANS.free)).toBe(0);
  });
});

describe("PLAN_COMPARISON", () => {
  const rowOf = (label: string) => PLAN_COMPARISON.flatMap((group) => group.rows).find((row) => row.label === label);

  it("reads the limits of plans.ts", () => {
    expect(rowOf("Témoignages conservés et affichés")?.values).toEqual({
      free: { kind: "text", label: "15" },
      essentiel: { kind: "text", label: "Illimités" },
      pro: { kind: "text", label: "Illimités" },
    });
    expect(rowOf("Demandes automatiques après une vente")?.values.free).toEqual({ kind: "text", label: "20 par mois" });
    expect(rowOf("Mur, carrousel et badge")?.values.free).toEqual({ kind: "text", label: "1 au choix" });
  });

  it("lets only the plan that can remove the mention say so", () => {
    const mention = rowOf(POWERED_BY_MENTION)?.values;
    expect(mention?.pro).toEqual({ kind: "text", label: "Retirable" });
    expect(mention?.essentiel).toEqual({ kind: "text", label: "Affichée" });
  });

  it("keeps « Tri par offre » in the three plans (decision of 2 October)", () => {
    expect(Object.values(rowOf("Tri par offre")?.values ?? {})).toEqual([
      { kind: "included" },
      { kind: "included" },
      { kind: "included" },
    ]);
  });
});
