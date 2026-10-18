import { describe, expect, it } from "vitest";
import { UNLIMITED } from "@/config/plans";
import { readDisplayedWidgetIds } from "./free-plan-widgets";

const widget = (id: string, createdAt: string, freePlanChosenAt: string | null = null) => ({
  id,
  createdAt: new Date(createdAt),
  freePlanChosenAt: freePlanChosenAt === null ? null : new Date(freePlanChosenAt),
});

describe("readDisplayedWidgetIds", () => {
  const wall = widget("mur", "2026-09-03");
  const carousel = widget("carrousel", "2026-09-20");
  const badge = widget("badge", "2026-10-01");

  it("shows every widget while the plan allows them", () => {
    expect(readDisplayedWidgetIds([wall, carousel, badge], UNLIMITED)).toEqual(new Set(["mur", "carrousel", "badge"]));
    expect(readDisplayedWidgetIds([wall], 1)).toEqual(new Set(["mur"]));
  });

  it("keeps the oldest on the free plan, the others paused", () => {
    expect(readDisplayedWidgetIds([badge, carousel, wall], 1)).toEqual(new Set(["mur"]));
  });

  it("keeps the one chosen last with « Afficher celui-ci à la place »", () => {
    const chosen = widget("carrousel", "2026-09-20", "2026-10-13");
    const chosenBefore = widget("badge", "2026-10-01", "2026-10-12");
    expect(readDisplayedWidgetIds([wall, chosen, chosenBefore], 1)).toEqual(new Set(["carrousel"]));
  });
});
