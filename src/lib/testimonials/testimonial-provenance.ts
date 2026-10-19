/**
 * Where a testimonial comes from (positionnement.md, « Avis de vrais clients », point 1), stored with it once:
 * - « sale »: the answer to the request of a sale received from a connector, the only one that will ever carry a
 *   mention of verification;
 * - « request »: the answer to « Demander un avis », for a customer the creator typed in;
 * - « added »: written in by the creator (« Ajouter un témoignage »);
 * - « import »: a line of a CSV file;
 * - « public-link »: left from the public collection page, without a request.
 */
export const TESTIMONIAL_PROVENANCES = ["sale", "request", "added", "import", "public-link"] as const;

export type TestimonialProvenance = (typeof TESTIMONIAL_PROVENANCES)[number];

type ProvenanceSource = {
  provenance: TestimonialProvenance | null;
  source: "form" | "manual" | "csv";
};

/** A row written by the code of before lot 4.13 has no provenance: its source tells all but a request. */
export const readTestimonialProvenance = ({ provenance, source }: ProvenanceSource): TestimonialProvenance => {
  if (provenance) return provenance;
  if (source === "manual") return "added";
  if (source === "csv") return "import";
  return "public-link";
};

/** A purchase PULSACITY knows: the month of the purchase goes with the testimonial. */
export const hasKnownPurchase = (provenance: TestimonialProvenance): boolean =>
  provenance === "sale" || provenance === "request";
