import { Fragment, type ReactNode } from "react";
import { PASTE_GUIDE_STEPS, PASTE_GUIDE_SUMMARY, type PasteGuidePart } from "@/lib/widgets/paste-guide-steps";
import { cn } from "@/lib/cn";
import {
  AddHtmlElementDrawing,
  EditCodeDrawing,
  PasteCodeDrawing,
  SaveAndPreviewDrawing,
} from "./PasteGuideIllustrations";

const DRAWINGS: ReactNode[] = [
  <AddHtmlElementDrawing key="add" />,
  <EditCodeDrawing key="edit" />,
  <PasteCodeDrawing key="paste" />,
  <SaveAndPreviewDrawing key="save" />,
];

const renderPart = (part: PasteGuidePart, index: number) =>
  typeof part === "string" ? (
    <Fragment key={index}>{part}</Fragment>
  ) : (
    <strong key={index} className="font-bold">
      {part.strong}
    </strong>
  );

type PasteGuideStepsProps = { layout: "grid" | "pairs" | "column" };

const LIST_CLASSES: Record<PasteGuideStepsProps["layout"], string> = {
  grid: "grid grid-cols-[repeat(auto-fill,minmax(232px,1fr))] gap-5",
  pairs: "grid gap-6 desktop:grid-cols-2",
  column: "flex flex-col gap-6",
};

/**
 * The four steps, each with its drawing: side by side in the editor, two by two on the public page of Systeme.io (m21),
 * one below the other on its own page.
 */
export const PasteGuideSteps = ({ layout }: PasteGuideStepsProps) => (
  <ol className={LIST_CLASSES[layout]}>
    {PASTE_GUIDE_STEPS.map((parts, index) => (
      <li key={index} className={layout === "pairs" ? "flex flex-col gap-3" : "flex flex-col gap-4"}>
        <div className={cn("overflow-hidden rounded-card bg-sky", layout === "column" && "desktop:max-w-[560px]")}>
          {DRAWINGS[index]}
        </div>
        {layout === "pairs" ? (
          // The public page of Systeme.io keeps its own layout until the site's maquettes v2 (lot 4.7).
          <p className="text-small">
            <span className="font-bold">{`${index + 1}.`}</span> {parts.map(renderPart)}
          </p>
        ) : (
          // Maquettes 3.4, Étapes numérotées: a true sequence, each number on a Soleil disc of 36.
          <div className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="flex size-[36px] shrink-0 items-center justify-center rounded-full bg-sun font-display text-[18px] leading-[1]"
            >
              {index + 1}
            </span>
            <p className="pt-[5px] text-body">
              <span className="sr-only">{`${index + 1}. `}</span>
              {parts.map(renderPart)}
            </p>
          </div>
        )}
      </li>
    ))}
  </ol>
);

/** Maquette 6, « Coller dans Systeme.io »: four illustrated steps under the editor, outlined once the code is copied. */
export const SystemePasteGuide = ({ isCodeCopied = false }: { isCodeCopied?: boolean }) => (
  <section
    aria-labelledby="paste-guide"
    className={cn(
      "flex flex-col gap-6 rounded-panel border-2 bg-white p-6 desktop:p-8",
      isCodeCopied ? "border-ink" : "border-transparent",
    )}
  >
    <div className="flex flex-col gap-1 desktop:flex-row desktop:items-baseline desktop:justify-between desktop:gap-6">
      <h2 id="paste-guide" className="scroll-mt-6 font-display text-h2">
        Coller dans Systeme.io
      </h2>
      <p className={cn("text-small", isCodeCopied ? "font-bold text-success" : "text-gray")}>
        {isCodeCopied ? "Code copié, à vous de jouer" : PASTE_GUIDE_SUMMARY}
      </p>
    </div>
    <PasteGuideSteps layout="grid" />
  </section>
);
