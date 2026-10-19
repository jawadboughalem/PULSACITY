// @vitest-environment jsdom
import { act } from "react";
import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { RequestMagicLinkResult } from "@/app/(auth)/request-magic-link";
import { MagicLinkForm } from "./MagicLinkForm";

const { requestMagicLink } = vi.hoisted(() => ({
  requestMagicLink: vi.fn<(previous: unknown, formData: FormData) => Promise<RequestMagicLinkResult>>(),
}));

vi.mock("@/app/(auth)/request-magic-link", () => ({ requestMagicLink }));

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  requestMagicLink.mockReset();
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

const emailField = () => container.querySelector("#email") as HTMLInputElement;
const heardFromField = () => container.querySelector("#heard-from") as HTMLSelectElement;

/** Types and chooses the way a person does: React hears the input and change events. */
const typeEmail = (value: string) => {
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(emailField(), value);
  emailField().dispatchEvent(new Event("input", { bubbles: true }));
};

const chooseHeardFrom = (value: string) => {
  heardFromField().value = value;
  heardFromField().dispatchEvent(new Event("change", { bubbles: true }));
};

const submit = async () => {
  await act(async () => {
    container.querySelector("form")?.requestSubmit();
  });
};

describe("MagicLinkForm", () => {
  it("keeps the address and the answer to « Comment avez-vous connu PULSACITY ? » after an error (maquette 3.4)", async () => {
    requestMagicLink.mockResolvedValue({ ok: false, error: "invalid-email" });
    act(() => root.render(<MagicLinkForm asksHeardFrom />));
    act(() => {
      typeEmail("test@exemple");
      chooseHeardFrom("youtube");
    });

    await submit();

    expect(container.textContent).toContain("Cette adresse e-mail est incomplète.");
    expect(emailField().value).toBe("test@exemple");
    expect(heardFromField().value).toBe("youtube");
  });

  it("sends the answer with the address", async () => {
    requestMagicLink.mockResolvedValue({ ok: true, data: { email: "julie@exemple.fr" } });
    act(() => root.render(<MagicLinkForm asksHeardFrom source={{ utm_source: "linkedin" }} />));
    act(() => {
      typeEmail("julie@exemple.fr");
      chooseHeardFrom("youtube");
    });

    await submit();

    const formData = requestMagicLink.mock.calls[0]?.[1];
    expect(formData?.get("email")).toBe("julie@exemple.fr");
    expect(formData?.get("connu")).toBe("youtube");
    expect(formData?.get("utm_source")).toBe("linkedin");
    expect(container.textContent).toContain("Un lien vous attend dans votre boîte de réception.");
  });
});
