// @vitest-environment jsdom
import { type ComponentProps, act } from "react";
import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { submitTestimonialForm } from "@/app/t/[spaceSlug]/submit-testimonial-form";
import { CollectionView } from "./CollectionView";

vi.mock("@/app/t/[spaceSlug]/submit-testimonial-form", () => ({ submitTestimonialForm: vi.fn() }));
vi.mock("@/app/t/[spaceSlug]/request-testimonial-photo-upload", () => ({ requestTestimonialPhotoUpload: vi.fn() }));
vi.mock("@sentry/nextjs", () => ({ captureException: vi.fn() }));

const JULIE_NUTRITION: ComponentProps<typeof CollectionView> = {
  spaceSlug: "julie-nutrition",
  productSlug: "programme-30-jours",
  requestToken: null,
  prefilledName: "",
  spaceName: "Julie Nutrition",
  logoUrl: null,
  replyToEmail: "julie@exemple.fr",
  referralCode: "k7m2xq9p",
  homeUrl: "https://pulsacity.com",
  title: "Votre avis sur « Programme 30 jours » ?",
  consentText: "J'accepte que ce témoignage soit publié sur les supports de Julie Nutrition.",
};

const BODY = "En 30 jours j'ai arrêté de grignoter le soir. Julie explique sans culpabiliser, c'est la première fois.";

let container: HTMLDivElement;
let root: Root;

const renderCollection = async (props: Partial<ComponentProps<typeof CollectionView>> = {}) => {
  await act(async () => root.render(<CollectionView {...JULIE_NUTRITION} {...props} />));
};

const find = <T extends Element>(selector: string): T => {
  const element = container.querySelector<T>(selector);
  if (!element) throw new TypeError(`Nothing matches ${selector}`);
  return element;
};

const typeInto = async (element: HTMLInputElement | HTMLTextAreaElement, value: string) => {
  const prototype = element instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(prototype, "value")?.set?.call(element, value);
  await act(async () => {
    element.dispatchEvent(new Event("input", { bubbles: true }));
  });
};

const click = async (element: HTMLElement) => {
  await act(async () => {
    element.click();
  });
};

const fillWithoutConsent = async () => {
  await click(find('input[aria-label="5 étoiles sur 5"]'));
  await typeInto(find("#testimonial-body"), BODY);
  await typeInto(find("#author-name"), "Camille R.");
  await typeInto(find("#author-title"), "Enseignante, Lyon");
};

const submit = () => click(find('button[type="submit"]'));

beforeEach(() => {
  Reflect.set(globalThis, "IS_REACT_ACT_ENVIRONMENT", true);
  vi.stubGlobal("scrollTo", vi.fn());
  vi.mocked(submitTestimonialForm).mockReset();
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  vi.unstubAllGlobals();
});

describe("CollectionView", () => {
  it("arrives with the space, the question and nothing chosen", async () => {
    await renderCollection();

    expect(find("header").textContent).toBe("JNJulie Nutrition");
    expect(find("h1").textContent).toBe("Votre avis sur « Programme 30 jours » ?");
    expect(container.textContent).toContain("Julie Nutrition lira chaque mot. Comptez moins d'une minute.");
    expect(container.textContent).toContain("Touchez une étoile.");
    expect(find<HTMLTextAreaElement>("#testimonial-body").placeholder).toBe("Qu'est-ce qui a changé pour vous ?");
    expect(find<HTMLInputElement>("#author-title").placeholder).toBe("Enseignante, Lyon");
    expect(container.textContent).toContain(JULIE_NUTRITION.consentText);
    expect(find<HTMLAnchorElement>('a[href^="https://pulsacity.com"]').href).toBe(
      "https://pulsacity.com/?ref=k7m2xq9p",
    );
  });

  it("thanks the client for the rating they touched", async () => {
    await renderCollection();

    await click(find('input[aria-label="4 étoiles sur 5"]'));

    expect(container.textContent).toContain("4 sur 5, merci.");
  });

  it("shows the name taken from the purchase until the client starts typing", async () => {
    await renderCollection({ prefilledName: "Camille R.", requestToken: "token" });

    expect(find<HTMLInputElement>("#author-name").value).toBe("Camille R.");
    expect(container.textContent).toContain("Repris de votre achat. Vous pouvez le modifier.");

    await typeInto(find("#testimonial-body"), "Merci");

    expect(container.textContent).not.toContain("Repris de votre achat.");
  });

  it("asks for consent before sending, keeping the text and moving the focus to the box", async () => {
    await renderCollection();
    await fillWithoutConsent();

    await submit();

    expect(find('[role="alert"]').textContent).toBe(
      "Julie Nutrition a besoin de votre accord pour publier ce témoignage. Cochez la case, puis renvoyez : votre texte est bien conservé.",
    );
    expect(document.activeElement).toBe(find('input[type="checkbox"]'));
    expect(find<HTMLTextAreaElement>("#testimonial-body").value).toBe(BODY);
    expect(submitTestimonialForm).not.toHaveBeenCalled();
  });

  it("sends the testimonial, then thanks the client by their first name", async () => {
    vi.mocked(submitTestimonialForm).mockResolvedValue({ ok: true, data: null });
    await renderCollection();
    await fillWithoutConsent();
    await click(find('input[type="checkbox"]'));

    await submit();

    expect(submitTestimonialForm).toHaveBeenCalledWith(
      expect.objectContaining({
        spaceSlug: "julie-nutrition",
        productSlug: "programme-30-jours",
        rating: 5,
        body: BODY,
        authorName: "Camille R.",
        authorTitle: "Enseignante, Lyon",
        hasConsented: true,
        photoKey: null,
      }),
    );
    expect(find('[role="status"]').textContent).toBe("Votre témoignage est bien envoyé.");
    expect(find("h1").textContent).toBe("Merci Camille.");
    expect(container.textContent).toContain(
      "« En 30 jours j'ai arrêté de grignoter le soir. Julie explique sans culpabiliser… »",
    );
    expect(container.textContent).toContain("Camille R. · Enseignante, Lyon");
    expect(container.textContent).toContain("Julie Nutrition le relit avant de le publier. Vous pouvez fermer cette page.");
  });

  it("keeps everything typed when the testimonial cannot leave", async () => {
    vi.mocked(submitTestimonialForm).mockRejectedValue(new TypeError("Failed to fetch"));
    await renderCollection();
    await fillWithoutConsent();
    await click(find('input[type="checkbox"]'));

    await submit();

    expect(find('[role="alert"]').textContent).toContain("Votre avis n'a pas pu partir.");
    expect(find<HTMLTextAreaElement>("#testimonial-body").value).toBe(BODY);
  });

  it("explains a request link used meanwhile, with a way to write to the creator", async () => {
    vi.mocked(submitTestimonialForm).mockResolvedValue({ ok: false, error: "link-inactive" });
    await renderCollection({ requestToken: "token" });
    await fillWithoutConsent();
    await click(find('input[type="checkbox"]'));

    await submit();

    expect(find("h1").textContent).toBe("Ce lien n'est plus actif");
    expect(find<HTMLAnchorElement>('a[href^="mailto:"]').href).toBe("mailto:julie@exemple.fr");
  });
});
