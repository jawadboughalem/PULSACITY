/** The pages a visitor can ask for, shared by the form and the action that reads it. */
export const BRIEF_PAGE_OPTIONS = [
  { value: 'accueil', label: 'Accueil' },
  { value: 'prestations', label: 'Prestations' },
  { value: 'tarifs-ou-devis', label: 'Tarifs ou devis' },
  { value: 'avis', label: 'Avis' },
  { value: 'contact', label: 'Contact' },
  { value: 'autre', label: 'Autre' },
] as const;

export type BriefPageValue = (typeof BRIEF_PAGE_OPTIONS)[number]['value'];

export const BRIEF_PAGE_VALUES = BRIEF_PAGE_OPTIONS.map((option) => option.value);

export function briefPageLabel(value: string): string {
  return BRIEF_PAGE_OPTIONS.find((option) => option.value === value)?.label ?? value;
}
