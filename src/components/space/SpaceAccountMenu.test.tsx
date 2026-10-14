// @vitest-environment jsdom
import type { AnchorHTMLAttributes, MouseEvent } from "react";
import { act } from "react";
import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SpaceAccountMenu } from "./SpaceAccountMenu";

vi.mock("@/app/app/sign-out-action", () => ({ signOut: vi.fn() }));
vi.mock("next/link", () => ({
  default: ({ onClick, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      {...props}
      onClick={(event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        onClick?.(event);
      }}
    />
  ),
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

const account = { name: "Julie Nutrition", email: "julie@exemple.fr", planName: "Gratuit", logoUrl: null };

describe("SpaceAccountMenu", () => {
  it("closes once one of its links is followed: the layout, and so the menu, stays on the next page", () => {
    act(() => root.render(<SpaceAccountMenu account={account} />));
    const trigger = container.querySelector("button[aria-expanded]") as HTMLButtonElement;

    act(() => trigger.click());
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    const accountLink = [...container.querySelectorAll("a")].find((link) => link.textContent === "Mon compte");
    expect(accountLink?.getAttribute("href")).toBe("/app/compte");

    act(() => accountLink?.click());

    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(container.querySelector("a")).toBeNull();
  });
});
