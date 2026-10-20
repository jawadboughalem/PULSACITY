import type { ComponentProps } from "react";
import { render } from "react-email";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NewTestimonialEmail, buildNewTestimonialSubject } from "./NewTestimonialEmail";

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://pulsacity.com");
});

const TESTIMONIAL: ComponentProps<typeof NewTestimonialEmail> = {
  spaceName: "Julie Nutrition",
  productName: "Programme 30 jours",
  authorName: "Camille R.",
  authorTitle: "Enseignante, Lyon",
  rating: 4,
  body: "En 30 jours j'ai arrêté de grignoter le soir.",
  provenance: "sale",
  purchasedAt: new Date("2026-08-28T10:00:00Z"),
  purchaseConnector: "systeme",
  appUrl: "https://pulsacity.com",
  planName: "Gratuit",
  planTestimonialLimit: 15,
  isOverPlanLimit: false,
  priceList: "founder",
};

const read = (text: string) => text.replaceAll("\u2060", "").replace(/[\u00a0\u202f]/g, " ");

describe("buildNewTestimonialSubject", () => {
  it("names the author and the rating", () => {
    expect(buildNewTestimonialSubject("Camille", 5)).toBe("Nouveau témoignage de Camille (5/5)");
  });

  it("elides « de » before a first name starting with a vowel", () => {
    expect(buildNewTestimonialSubject("Inès", 4)).toBe("Nouveau témoignage d'Inès (4/5)");
  });
});

describe("NewTestimonialEmail", () => {
  it("shows the whole testimonial, where it comes from, waiting for validation (maquettes 3.6)", async () => {
    const text = read(await render(<NewTestimonialEmail {...TESTIMONIAL} />, { plainText: true }));

    expect(text).toContain("★★★★☆ 4 sur 5");
    expect(text).toContain("« En 30 jours j'ai arrêté de grignoter le soir. »");
    expect(text).toContain("Camille R. · Enseignante, Lyon");
    expect(text).toContain("Vente reçue de Systeme.io · achat du 28 août 2026");
    expect(text).toContain("Un nouveau témoignage sur Programme 30 jours vient d'arriver dans votre espace Julie Nutrition.");
    expect(text).toContain("En attente de votre validation");
    expect(text).toContain("https://pulsacity.com/app/temoignages");
    expect(text).toContain("Vous recevez cet e-mail à chaque nouveau témoignage. Régler les notifications");
    expect(text).toContain("https://pulsacity.com/app/reglages#settings-notifications");
    expect(text).not.toContain("plan Essentiel");
  });

  it("says where a testimonial without a sale comes from", async () => {
    const request = read(await render(<NewTestimonialEmail {...TESTIMONIAL} provenance="request" />, { plainText: true }));
    const link = read(
      await render(<NewTestimonialEmail {...TESTIMONIAL} provenance="public-link" purchasedAt={null} />, { plainText: true }),
    );

    expect(request).toContain("Demande manuelle · achat du 28 août 2026");
    expect(link).toContain("Laissé depuis votre lien de collecte · date d'achat inconnue");
  });

  it("once the free plan is full, keeps the testimonial and quotes Essentiel at the price the site shows", async () => {
    const founder = read(await render(<NewTestimonialEmail {...TESTIMONIAL} isOverPlanLimit />, { plainText: true }));
    const publicPrices = read(
      await render(<NewTestimonialEmail {...TESTIMONIAL} isOverPlanLimit priceList="public" authorName="Inès V." />, {
        plainText: true,
      }),
    );

    expect(founder).toContain("Votre plan Gratuit compte déjà 15 témoignages validés.");
    expect(founder).toContain(
      "Celui de Camille est gardé, en attente : rien n'est perdu. Avec Essentiel, à 9,99 € par mois, tous vos témoignages s'affichent.",
    );
    expect(founder).toContain(
      "Prix de lancement, gardé à vie, pour les 100 premiers abonnés. Ensuite, 14,99 € par mois. Vous payez le prix affiché.",
    );
    expect(founder).toContain("Découvrir le plan Essentiel");
    expect(founder).toContain("https://pulsacity.com/app/facturation");
    expect(publicPrices).toContain("Celui d'Inès est gardé");
    expect(publicPrices).toContain("à 14,99 € par mois");
    expect(publicPrices).not.toContain("Prix de lancement");
    expect(founder).not.toMatch(/TVA| HT/);
  });
});
