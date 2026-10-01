import type { WidgetPayload } from "./payload";

/** The page of Julie Nutrition in maquette 2: 47 validated testimonials, the first four shown. */
export const SAMPLE_PAYLOAD: WidgetPayload = {
  v: 1,
  type: "wall",
  theme: "auto",
  accentColor: "#4F6F52",
  cardStyle: "sharp",
  total: 47,
  average: 4.8,
  testimonials: [
    {
      name: "Camille R.",
      initials: "CR",
      title: "Enseignante",
      photo: null,
      rating: 5,
      text: "En 30 jours j'ai arrêté de grignoter le soir. Julie explique sans culpabiliser, c'est la première fois qu'un programme tient dans ma vraie vie.",
      date: "2026-09-12",
    },
    {
      name: "Thomas L.",
      initials: "TL",
      title: "Développeur",
      photo: null,
      rating: 5,
      text: "Les recettes sont rapides et le groupe motive vraiment. J'ai perdu 4 kg sans me priver.",
      date: "2026-09-03",
    },
    {
      name: "Sophie D.",
      initials: "SD",
      title: "Maman de 3 enfants",
      photo: "https://photos.exemple.fr/sophie.jpg",
      rating: 5,
      text: "Toute la famille mange mieux. Les menus de la semaine m'ont sauvé la vie.",
      date: "2026-09-27",
    },
    {
      name: "Nadia B.",
      initials: "NB",
      title: "Infirmière de nuit",
      photo: null,
      rating: 4,
      text: "Enfin des conseils adaptés aux horaires décalés. J'aurais aimé plus de recettes végétariennes.",
      date: "2026-09-26",
    },
  ],
  avatars: [],
  next: 4,
  poweredBy: "https://pulsacity.com/?ref=julie42",
};

export const SAMPLE_BADGE_PAYLOAD: WidgetPayload = {
  ...SAMPLE_PAYLOAD,
  type: "badge",
  testimonials: [],
  avatars: [
    { initials: "CR", photo: null },
    { initials: "TL", photo: null },
    { initials: "SD", photo: "https://photos.exemple.fr/sophie.jpg" },
  ],
  next: null,
};
