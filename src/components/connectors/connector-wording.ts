/** The words of a connector's page in the space (m5): Systeme.io is a tool, the universal connector is any tool. */
export type ConnectorWording = {
  title: string;
  intro: string;
  /** How the texts of the page name the tool where the address is pasted: « Collez-les dans … », « Produit reçu de … ». */
  toolName: string;
  addressDescription: string;
  pasteTitle: string;
  pasteDescription: { phone: string; computer: string };
  testTitle: string;
  testDescription: string;
};

const SYSTEME_TEST_DESCRIPTION =
  "Le voyant en haut de la page passe au vert dès la première vente reçue. Pour tester sans payer, achetez votre offre avec un code promo à 100 %.";

const WORDINGS: Record<string, ConnectorWording> = {
  universal: {
    title: "Connecteur universel",
    intro:
      "Envoyez vos ventes depuis n'importe quel outil, directement ou avec Zapier, Make ou n8n : chacune déclenche une demande d'avis, au bon moment.",
    toolName: "votre outil",
    addressDescription:
      "C'est à cette adresse que votre outil nous envoie chaque vente. Elle vous est propre : ne la partagez pas.",
    pasteTitle: "L'utiliser dans votre outil",
    pasteDescription: {
      phone: "Plus simple depuis un ordinateur.",
      computer: "Pour chaque vente, votre outil envoie ces champs à l'adresse, en JSON ou en formulaire.",
    },
    testTitle: "Envoyer une vente de test",
    testDescription: "Le voyant en haut de la page passe au vert dès la première vente reçue.",
  },
};

export const readConnectorWording = (connector: { id: string; name: string }): ConnectorWording =>
  WORDINGS[connector.id] ?? {
    title: `Connecter ${connector.name}`,
    intro: `Chaque vente sur ${connector.name} déclenche une demande d'avis, au bon moment, sans rien faire de plus.`,
    toolName: connector.name,
    addressDescription: `C'est par cette adresse que ${connector.name} nous prévient de chaque vente. Elle vous est propre : ne la partagez pas.`,
    pasteTitle: `La coller dans ${connector.name}`,
    pasteDescription: {
      phone: "Plus simple depuis un ordinateur.",
      computer: `Ouvrez ${connector.name} dans un autre onglet et suivez ces trois écrans.`,
    },
    testTitle: "Faire une vente test, ou attendre la prochaine",
    testDescription: SYSTEME_TEST_DESCRIPTION,
  };
