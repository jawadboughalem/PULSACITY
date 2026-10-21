// @vitest-environment jsdom
import { act } from "react";
import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { SendContactMessageResult } from "@/app/(marketing)/aide/contact-actions";
import { REPORT_DRAFT, readContactDraft } from "@/lib/support/report-content";
import { ContactForm } from "./ContactForm";

const { sendContactMessage } = vi.hoisted(() => ({
  sendContactMessage: vi.fn<(previous: unknown, formData: FormData) => Promise<SendContactMessageResult>>(),
}));

vi.mock("@/app/(marketing)/aide/contact-actions", () => ({ sendContactMessage }));

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  sendContactMessage.mockReset();
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

const field = (id: string) => container.querySelector(`#${id}`) as HTMLInputElement | HTMLTextAreaElement;

/** Types into a field the way a person does: React hears the input event. */
const type = (id: string, value: string) => {
  const element = field(id);
  const prototype = element instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(prototype, "value")?.set?.call(element, value);
  element.dispatchEvent(new Event("input", { bubbles: true }));
};

const submit = async () => {
  await act(async () => {
    container.querySelector("form")?.requestSubmit();
  });
};

const text = () => (container.textContent ?? "").replace(/[ ⁠]/g, (character) => (character === " " ? " " : ""));

const fillAndSend = async () => {
  act(() => {
    type("contact-subject", "Mon widget ne s'affiche pas");
    type("contact-message", "Bonjour, rien ne s'affiche.");
  });
  await submit();
};

describe("ContactForm", () => {
  it("types the address of a signed-in creator, and says where the answer goes while it is unchanged", () => {
    act(() => root.render(<ContactForm accountEmail="julie@exemple.fr" />));

    expect(field("contact-email").value).toBe("julie@exemple.fr");
    expect(text()).toContain("Adresse de votre compte : nous répondrons à cette adresse.");

    act(() => type("contact-email", "autre@exemple.fr"));
    expect(text()).not.toContain("Adresse de votre compte");
  });

  it("types the subject and the questions of a report, reached by « Signaler un contenu »", () => {
    expect(readContactDraft({ sujet: "signalement" })).toBe(REPORT_DRAFT);
    expect(readContactDraft({ sujet: "autre" })).toBeNull();
    act(() => root.render(<ContactForm accountEmail={null} draft={REPORT_DRAFT} />));

    expect(field("contact-subject").value).toBe("Signaler un contenu");
    expect(field("contact-message").value.replaceAll("\u00a0", " ")).toBe(
      "Page ou widget :\nContenu visé :\nPourquoi il est illicite :\n",
    );
  });

  it("lists every point to correct, beside each field, and keeps what was typed", async () => {
    sendContactMessage.mockResolvedValue({
      ok: false,
      error: "invalid-input",
      fieldErrors: { email: "Cette adresse e-mail est incomplète.", message: "Écrivez votre message." },
    });
    act(() => root.render(<ContactForm accountEmail={null} />));
    act(() => {
      type("contact-email", "julie@exemple");
      type("contact-subject", "Relier Kajabi");
    });

    await submit();

    const summary = container.querySelector('[role="alert"]');
    expect(summary?.textContent).toContain("2 points à corriger avant d'envoyer");
    expect([...(summary?.querySelectorAll("li") ?? [])].map((item) => item.textContent?.replace("⁠", ""))).toEqual([
      "Votre adresse e-mail",
      "Message",
    ]);
    expect(field("contact-email").getAttribute("aria-invalid")).toBe("true");
    expect(field("contact-subject").getAttribute("aria-invalid")).toBeNull();
    expect(field("contact-email").value).toBe("julie@exemple");
    expect(field("contact-subject").value).toBe("Relier Kajabi");
  });

  it("takes away the error of a field as soon as it is corrected, and the summary with the last one", async () => {
    sendContactMessage.mockResolvedValue({
      ok: false,
      error: "invalid-input",
      fieldErrors: { email: "Cette adresse e-mail est incomplète.", message: "Écrivez votre message." },
    });
    act(() => root.render(<ContactForm accountEmail={null} />));
    act(() => type("contact-email", "julie@exemple"));
    await submit();

    act(() => type("contact-email", "julie@exemple.fr"));
    expect(field("contact-email").getAttribute("aria-invalid")).toBeNull();
    expect(container.querySelector('[role="alert"]')?.textContent).toContain("1 point à corriger avant d'envoyer");

    act(() => type("contact-message", "Bonjour"));
    expect(field("contact-message").getAttribute("aria-invalid")).toBeNull();
    expect(container.querySelector('[role="alert"]')).toBeNull();
  });

  it("confirms the message and its address, then opens a new one with the same address", async () => {
    sendContactMessage.mockResolvedValue({ ok: true, data: { email: "julie@exemple.fr" } });
    act(() => root.render(<ContactForm accountEmail="julie@exemple.fr" />));

    await fillAndSend();

    expect(container.querySelector("form")).toBeNull();
    expect(text()).toContain("Message envoyé.");
    expect(text()).toContain("Nous vous répondons sous deux jours ouvrés, à julie@exemple.fr.");

    const another = [...container.querySelectorAll("button")].find((button) => button.textContent === "Écrire un autre message");
    act(() => another?.click());

    expect(container.querySelector("form")).not.toBeNull();
    expect(field("contact-email").value).toBe("julie@exemple.fr");
    expect(field("contact-subject").value).toBe("");
    expect(field("contact-message").value).toBe("");
  });

  it("asks to wait after several messages, the text kept", async () => {
    sendContactMessage.mockResolvedValue({ ok: false, error: "too-many-requests" });
    act(() => root.render(<ContactForm accountEmail="julie@exemple.fr" />));

    await fillAndSend();

    expect(text()).toContain("Plusieurs messages sont partis en peu de temps.");
    expect(text()).toContain("Patientez quelques minutes, puis réessayez. Votre texte est gardé.");
    expect(field("contact-message").value).toBe("Bonjour, rien ne s'affiche.");
  });

  it("gives the address to write to when the message could not leave", async () => {
    sendContactMessage.mockResolvedValue({ ok: false, error: "not-sent" });
    act(() => root.render(<ContactForm accountEmail={null} />));
    act(() => type("contact-email", "julie@exemple.fr"));

    await fillAndSend();

    expect(text()).toContain("Votre message n'est pas parti.");
    expect(container.querySelector('a[href="mailto:contact@pulsacity.com"]')?.textContent).toBe("contact@pulsacity.com");
    expect(field("contact-subject").value).toBe("Mon widget ne s'affiche pas");
  });
});
