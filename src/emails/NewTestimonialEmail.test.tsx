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
  authorPhotoUrl: null,
  rating: 4,
  body: "En 30 jours j'ai arrêté de grignoter le soir.",
  spaceUrl: "https://pulsacity.com/app",
  planName: "Gratuit",
  planTestimonialLimit: 15,
  isOverPlanLimit: false,
};

describe("buildNewTestimonialSubject", () => {
  it("names the author and the rating", () => {
    expect(buildNewTestimonialSubject("Camille", 5)).toBe("Nouveau témoignage de Camille (5/5)");
  });

  it("elides « de » before a first name starting with a vowel", () => {
    expect(buildNewTestimonialSubject("Inès", 4)).toBe("Nouveau témoignage d'Inès (4/5)");
  });
});

describe("NewTestimonialEmail", () => {
  it("shows the whole testimonial, waiting for validation", async () => {
    const text = await render(<NewTestimonialEmail {...TESTIMONIAL} />, { plainText: true });

    expect(text).toContain("★★★★☆ 4 sur 5");
    expect(text).toContain("« En 30 jours j'ai arrêté de grignoter le soir. »");
    expect(text).toContain("Camille R. · Enseignante, Lyon");
    expect(text).toContain("Programme 30 jours");
    expect(text).toContain("En attente de votre validation.");
    expect(text).toContain("https://pulsacity.com/app");
    expect(text).not.toContain("Passez au plan Essentiel");
  });

  it("invites to upgrade once the plan is full, saying the testimonial is kept", async () => {
    const text = await render(<NewTestimonialEmail {...TESTIMONIAL} isOverPlanLimit />, { plainText: true });

    expect(text).toContain(
      "Votre plan Gratuit inclut 15 témoignages. Celui-ci est bien conservé, en attente. Passez au plan Essentiel pour le publier.",
    );
  });
});
