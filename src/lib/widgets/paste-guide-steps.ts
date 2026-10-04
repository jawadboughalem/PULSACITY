/** A part of a step, in bold when it names what the creator clicks on in Systeme.io. */
export type PasteGuidePart = string | { strong: string };

/** « Coller dans Systeme.io », the same four steps in the editor, on its own page and in the e-mail of the code. */
export const PASTE_GUIDE_STEPS: PasteGuidePart[][] = [
  [
    "Dans l'éditeur de votre page Systeme.io, glissez un élément ",
    { strong: "Code HTML" },
    " là où vous voulez les avis.",
  ],
  ["Cliquez sur l'élément, puis sur ", { strong: "Modifier le code" }, "."],
  ["Collez le code copié dans la fenêtre de l'élément, puis validez."],
  [
    "Enregistrez la page, puis ouvrez son aperçu : le code ne s'exécute pas dans l'éditeur. Vos avis s'affichent, les nouveaux s'ajouteront seuls.",
  ],
];

export const PASTE_GUIDE_DURATION = "4 étapes, environ 2 minutes";
