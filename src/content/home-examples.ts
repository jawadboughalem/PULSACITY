import { NO_BREAK_SPACE } from "@/lib/french/typography";

/**
 * The fictitious reviews of the home page (positionnement.md, section 5), one of them at 4 stars, with the dates of
 * the maquettes 3.5. They are never shown without « Exemple, avis fictifs ».
 */
export type ExampleReview = {
  name: string;
  /** What the customer bought, under the name: « Formation en ligne ». */
  offer: string;
  rating: number;
  text: string;
  /** YYYY-MM-DD. */
  date: string;
};

export const EXAMPLE_REVIEWS: ExampleReview[] = [
  {
    name: "Camille",
    offer: "Formation en ligne",
    rating: 5,
    text: "Les modules sont courts et concrets. J'ai lancé mon offre dès la troisième semaine.",
    date: "2026-09-12",
  },
  {
    name: "Karim",
    offer: "Accompagnement",
    rating: 4,
    text: "Un accompagnement exigeant et bienveillant. J'aurais aimé un peu plus d'exercices.",
    date: "2026-09-03",
  },
  {
    name: "Léa",
    offer: "Séance",
    rating: 5,
    text: "Une séance qui m'a vraiment apaisée.",
    date: "2026-09-26",
  },
];

/** The example rating of the site: 4,7/5 rather than 4,9/5 (positionnement.md, Spiegel Research Center). */
export const EXAMPLE_AVERAGE = 4.7;

export const EXAMPLE_COUNT = 23;

export const EXAMPLE_AVERAGE_LABEL = `4,7/5${NO_BREAK_SPACE}· ${EXAMPLE_COUNT}${NO_BREAK_SPACE}avis`;
