import type { ReactNode } from "react";
import {
  AddHtmlElementDrawing,
  EditCodeDrawing,
  PasteCodeDrawing,
  SaveAndPreviewDrawing,
} from "./PasteGuideIllustrations";

type Step = { drawing: ReactNode; text: ReactNode };

const STEPS: Step[] = [
  {
    drawing: <AddHtmlElementDrawing />,
    text: (
      <>
        Dans l&apos;éditeur de votre page Systeme.io, glissez un élément <strong className="font-semibold">Code HTML</strong>{" "}
        là où vous voulez les avis.
      </>
    ),
  },
  {
    drawing: <EditCodeDrawing />,
    text: (
      <>
        Cliquez sur l&apos;élément, puis sur <strong className="font-semibold">Modifier le code</strong>.
      </>
    ),
  },
  {
    drawing: <PasteCodeDrawing />,
    text: <>Collez le code copié dans la fenêtre de l&apos;élément, puis validez.</>,
  },
  {
    drawing: <SaveAndPreviewDrawing />,
    text: (
      <>
        Enregistrez la page, puis ouvrez son aperçu : le code ne s&apos;exécute pas dans l&apos;éditeur. Vos avis
        s&apos;affichent, les nouveaux s&apos;ajouteront seuls.
      </>
    ),
  },
];

/** Maquette 6, « Coller dans Systeme.io »: four illustrated steps under the editor. */
export const SystemePasteGuide = () => (
  <section aria-labelledby="paste-guide" className="flex flex-col gap-4 border border-hairline-200 bg-white p-5 desktop:p-6">
    <div className="flex flex-col gap-1 desktop:flex-row desktop:items-baseline desktop:justify-between desktop:gap-5">
      <h2 id="paste-guide" className="font-serif text-quote font-medium">
        Coller dans Systeme.io
      </h2>
      <p className="text-small text-slate-600">4 étapes, environ 2 minutes</p>
    </div>
    <ol className="grid grid-cols-[repeat(auto-fill,minmax(232px,1fr))] gap-5">
      {STEPS.map((step, index) => (
        <li key={index} className="flex flex-col gap-3">
          <div className="border border-hairline-200 bg-paper-100">{step.drawing}</div>
          <p className="text-small">
            <span className="font-semibold">{`${index + 1}.`}</span> {step.text}
          </p>
        </li>
      ))}
    </ol>
  </section>
);
