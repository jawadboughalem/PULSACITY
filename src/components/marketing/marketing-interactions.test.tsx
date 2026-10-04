// @vitest-environment jsdom
import { act } from "react";
import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ChoiceScope, ChoiceToggle } from "./ChoiceScope";
import { MarketingNav } from "./MarketingNav";

vi.mock("next/navigation", () => ({ usePathname: () => "/tarifs" }));

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

const buttonNamed = (name: string) =>
  [...container.querySelectorAll("button")].find((button) => button.textContent === name) as HTMLButtonElement;

describe("ChoiceToggle", () => {
  it("switches the prices of m8 to the year, and says so to screen readers", () => {
    act(() =>
      root.render(
        <ChoiceScope initial="monthly" className="group/billing">
          <ChoiceToggle
            label="Période de paiement"
            options={[
              { value: "monthly", label: "Mensuel" },
              { value: "yearly", label: "Annuel" },
            ]}
            announcements={{ monthly: "Prix mensuels affichés.", yearly: "Prix annuels affichés." }}
          />
        </ChoiceScope>,
      ),
    );
    const scope = container.querySelector("[data-choice]");
    expect(scope?.getAttribute("data-choice")).toBe("monthly");
    expect(buttonNamed("Mensuel").getAttribute("aria-pressed")).toBe("true");

    act(() => buttonNamed("Annuel").click());

    expect(scope?.getAttribute("data-choice")).toBe("yearly");
    expect(buttonNamed("Annuel").getAttribute("aria-pressed")).toBe("true");
    expect(buttonNamed("Mensuel").getAttribute("aria-pressed")).toBe("false");
    expect(container.querySelector('[role="status"]')?.textContent).toBe("Prix annuels affichés.");
  });
});

describe("MarketingNav", () => {
  it("marks the current page, and opens and closes the phone menu", () => {
    act(() => root.render(<MarketingNav />));
    const currentLinks = [...container.querySelectorAll('a[aria-current="page"]')].map((link) => link.textContent);
    expect(currentLinks).toEqual(["Tarifs", "Tarifs"]);

    const menuButton = container.querySelector("button[aria-controls]") as HTMLButtonElement;
    const menu = document.getElementById(menuButton.getAttribute("aria-controls") ?? "");
    expect(menu?.hidden).toBe(true);

    act(() => menuButton.click());
    expect(menuButton.getAttribute("aria-expanded")).toBe("true");
    expect(menu?.hidden).toBe(false);

    act(() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" })));
    expect(menu?.hidden).toBe(true);
    expect(document.activeElement).toBe(menuButton);
  });
});
