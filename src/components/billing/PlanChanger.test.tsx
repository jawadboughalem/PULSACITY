// @vitest-environment jsdom
import { act } from "react";
import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PlanChanger } from "./PlanChanger";

vi.mock("@/app/app/(espace)/facturation/billing-actions", () => ({
  changePlanAction: vi.fn(),
  openBillingPortalAction: vi.fn(),
  previewPlanChangeAction: vi.fn(),
}));

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

const freeColumn = () => container.querySelectorAll("li")[0] as HTMLLIElement;

const text = (element: Element) => (element.textContent ?? "").replace(/ /g, " ");

describe("PlanChanger", () => {
  it("stops a subscription from the free column", () => {
    act(() =>
      root.render(
        <PlanChanger
          current={{ plan: "essentiel", period: "monthly" }}
          priceList="founder"
          isSubscribed
          referralEssentielUntil={null}
        />,
      ),
    );

    expect(freeColumn().querySelector("button")?.textContent).toBe("Passer au plan Gratuit");
  });

  it("says when the month given by the referral ends, instead of a button that has nothing to stop", () => {
    act(() =>
      root.render(
        <PlanChanger
          current={{ plan: "essentiel", period: "monthly" }}
          priceList="founder"
          isSubscribed={false}
          referralEssentielUntil={new Date("2026-11-19T10:00:00Z")}
        />,
      ),
    );

    expect(freeColumn().querySelector("button")).toBeNull();
    expect(text(freeColumn())).toContain("Votre espace y repasse le 19 novembre 2026.");
  });

  it("has nothing to stop on a plan offered by PULSACITY", () => {
    act(() =>
      root.render(
        <PlanChanger
          current={{ plan: "pro", period: "monthly" }}
          priceList="founder"
          isSubscribed={false}
          referralEssentielUntil={null}
        />,
      ),
    );

    expect(freeColumn().querySelector("button")).toBeNull();
    expect(text(freeColumn())).toContain("Votre plan est offert : rien à arrêter.");
  });
});
