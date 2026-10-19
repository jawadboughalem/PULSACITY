import { describe, expect, it } from "vitest";
import {
  HIDDEN_REASONS,
  HIDDEN_REASON_LABELS,
  HIDDEN_REASON_PUBLIC_LABELS,
  describeHiddenReason,
} from "./hidden-reasons";
import { TESTIMONIAL_PROVENANCES, hasKnownPurchase, readTestimonialProvenance } from "./testimonial-provenance";

describe("describeHiddenReason", () => {
  it("gives the author the reason chosen, or the words typed for « Autre motif »", () => {
    expect(describeHiddenReason({ hiddenReason: "off-topic", hiddenReasonDetail: null })).toBe(
      "Il ne parle pas de mon offre",
    );
    expect(describeHiddenReason({ hiddenReason: "other", hiddenReasonDetail: " Un doublon de votre avis. " })).toBe(
      "Un doublon de votre avis.",
    );
    expect(describeHiddenReason({ hiddenReason: null, hiddenReasonDetail: null })).toBeNull();
  });

  it("names every reason for the creator and for the reader, and never speaks of verification", () => {
    for (const reason of HIDDEN_REASONS) {
      expect(HIDDEN_REASON_LABELS[reason]).not.toBe("");
      expect(HIDDEN_REASON_PUBLIC_LABELS[reason]).not.toBe("");
    }
    const labels = JSON.stringify([HIDDEN_REASON_LABELS, HIDDEN_REASON_PUBLIC_LABELS]).toLowerCase();
    expect(labels).not.toContain("vérifi");
  });
});

describe("readTestimonialProvenance", () => {
  it("keeps the provenance stored, else reads it from the source", () => {
    expect(readTestimonialProvenance({ provenance: "sale", source: "form" })).toBe("sale");
    expect(readTestimonialProvenance({ provenance: null, source: "manual" })).toBe("added");
    expect(readTestimonialProvenance({ provenance: null, source: "csv" })).toBe("import");
    expect(readTestimonialProvenance({ provenance: null, source: "form" })).toBe("public-link");
  });

  it("ties a purchase to a sale received or a request only", () => {
    expect(TESTIMONIAL_PROVENANCES.filter(hasKnownPurchase)).toEqual(["sale", "request"]);
  });
});
