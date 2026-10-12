/**
 * The format of the universal connector, ours (docs-internes/decisions/connecteurs.md): the fields a tool sends for each
 * sale, as JSON or as a form. Only the e-mail is required.
 */
export type UniversalField = {
  name: "email" | "prenom" | "nom" | "offre" | "date" | "montant" | "devise" | "reference";
  isRequired: boolean;
  /** What the creator puts in it, on the connector's page and its guides. */
  description: string;
  example: string;
};

export const UNIVERSAL_FIELDS: UniversalField[] = [
  { name: "email", isRequired: true, description: "L'adresse e-⁠mail du client.", example: "camille@example.com" },
  { name: "prenom", isRequired: false, description: "Son prénom, pour l'e-⁠mail de demande.", example: "Camille" },
  { name: "nom", isRequired: false, description: "Son nom.", example: "Martin" },
  {
    name: "offre",
    isRequired: false,
    description: "Le nom de ce qu'il a acheté. Vous l'associez une fois à une offre PULSACITY.",
    example: "Programme 30 jours",
  },
  { name: "date", isRequired: false, description: "Le jour de la vente. Sans date : le jour de réception.", example: "2026-10-12" },
  { name: "montant", isRequired: false, description: "Le prix payé.", example: "97" },
  { name: "devise", isRequired: false, description: "EUR si rien n'est indiqué.", example: "EUR" },
  {
    name: "reference",
    isRequired: false,
    description: "L'identifiant de la vente dans votre outil : une vente reçue deux fois ne compte qu'une fois.",
    example: "commande-1042",
  },
];
