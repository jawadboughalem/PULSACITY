/**
 * « Comment avez-vous connu PULSACITY ? » (inscription, maquette 3.4): a closed list drawn from the channels of
 * decisions/commercialisation.md. The keys are stored; the labels are those of the form.
 */
export const HEARD_FROM_OPTIONS = [
  { value: "communaute", label: "Un groupe Facebook ou une communauté" },
  { value: "partenaire", label: "Un formateur ou un partenaire" },
  { value: "badge", label: "Le badge « Propulsé par PULSACITY » sur une page" },
  { value: "bouche-a-oreille", label: "Un créateur qui m'en a parlé" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "recherche", label: "Une recherche sur internet" },
  { value: "autre", label: "Autre" },
] as const;

export type HeardFrom = (typeof HEARD_FROM_OPTIONS)[number]["value"];

export const HEARD_FROM_VALUES = HEARD_FROM_OPTIONS.map((option) => option.value) as [HeardFrom, ...HeardFrom[]];

export const isHeardFrom = (value: unknown): value is HeardFrom =>
  typeof value === "string" && (HEARD_FROM_VALUES as readonly string[]).includes(value);
