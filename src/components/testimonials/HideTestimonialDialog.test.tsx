// @vitest-environment jsdom
import { type ComponentProps, act } from "react";
import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HideTestimonialDialog } from "./HideTestimonialDialog";

let container: HTMLDivElement;
let root: Root;
let onConfirm: ReturnType<typeof vi.fn<ComponentProps<typeof HideTestimonialDialog>["onConfirm"]>>;

const renderDialog = async (props: Partial<ComponentProps<typeof HideTestimonialDialog>> = {}) => {
  await act(async () =>
    root.render(
      <HideTestimonialDialog
        isOpen
        authorName="Nadia B."
        authorReach="reachable"
        isReasonAlreadySent={false}
        isPending={false}
        onConfirm={onConfirm}
        onCancel={() => {}}
        {...props}
      />,
    ),
  );
};

const buttonNamed = (name: string) => {
  const button = [...container.querySelectorAll("button")].find((element) => element.textContent === name);
  if (!button) throw new TypeError(`No button « ${name} »`);
  return button;
};

/** The text read, its no-break spaces as plain ones. */
const readText = () => (container.textContent ?? "").replaceAll("\u00a0", " ");

const click = async (element: HTMLElement) => {
  await act(async () => element.click());
};

const choose = async (reason: string) => {
  const radio = container.querySelector<HTMLInputElement>(`input[value="${reason}"]`);
  if (!radio) throw new TypeError(`No reason ${reason}`);
  await click(radio);
};

beforeEach(() => {
  // jsdom opens no modal dialog: open it as the browser would.
  HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
    this.open = true;
  };
  HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
    this.open = false;
  };
  onConfirm = vi.fn();
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

describe("HideTestimonialDialog", () => {
  it("hides nothing without a reason, and says the reason goes to the author", async () => {
    await renderDialog();

    await click(buttonNamed("Masquer l'avis"));

    expect(onConfirm).not.toHaveBeenCalled();
    expect(readText()).toContain("Choisissez un motif : il est envoyé à Nadia B.");
    expect(readText()).not.toContain("Nadia B..");
    expect(container.querySelector('[role="radiogroup"]')?.getAttribute("aria-invalid")).toBe("true");
  });

  it("hides with the reason chosen", async () => {
    await renderDialog();

    await choose("personal-data");
    await click(buttonNamed("Masquer l'avis"));

    expect(onConfirm).toHaveBeenCalledWith({ reason: "personal-data", detail: null });
  });

  it("asks a few words for « Autre motif », sent as they are", async () => {
    await renderDialog();
    await choose("other");

    await click(buttonNamed("Masquer l'avis"));
    expect(onConfirm).not.toHaveBeenCalled();
    expect(readText()).toContain("Écrivez le motif en quelques mots : Nadia B. le lira tel quel.");

    const textarea = container.querySelector("textarea");
    if (!textarea) throw new TypeError("No textarea");
    await act(async () => {
      Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value")?.set?.call(textarea, " Un doublon. ");
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await click(buttonNamed("Masquer l'avis"));

    expect(onConfirm).toHaveBeenCalledWith({ reason: "other", detail: "Un doublon." });
  });

  it("says why the reason stays with the review when the author cannot receive it", async () => {
    await renderDialog({ authorReach: "no-address" });

    expect(readText()).toContain("sans adresse e-⁠mail, il ne peut pas être envoyé à Nadia B.");
  });

  it("promises no second e-mail when a reason was already sent for this review", async () => {
    await renderDialog({ isReasonAlreadySent: true });

    expect(readText()).toContain("Il reste avec l'avis : Nadia B. a déjà reçu un motif pour cet avis, un seul e-⁠mail par avis.");
    expect(readText()).not.toContain("le reçoit par e-⁠mail");
    await click(buttonNamed("Masquer l'avis"));
    expect(readText()).toContain("Choisissez un motif.");
    expect(readText()).not.toContain("il est envoyé à");
  });

  it("brings the focus to the missing answer, and announces the error", async () => {
    await renderDialog();

    await click(buttonNamed("Masquer l'avis"));
    expect(document.activeElement).toBe(container.querySelector('input[value="off-topic"]'));
    expect(container.querySelector('[role="alert"]')?.textContent).toContain("Choisissez un motif");

    await choose("other");
    await click(buttonNamed("Masquer l'avis"));
    expect(document.activeElement).toBe(container.querySelector("textarea"));
    expect(container.querySelector('[role="alert"]')?.textContent).toContain("Écrivez le motif en quelques mots");
  });

  it("elides « de » before a vowel and keeps the initial with the name", async () => {
    await renderDialog({ authorName: "Inès V." });

    expect(container.querySelector("h2")?.textContent).toBe("Masquer l'avis d'Inès\u00a0V.\u00a0?");
  });
});
