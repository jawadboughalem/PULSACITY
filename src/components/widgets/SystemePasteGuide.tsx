import { Fragment, type ReactNode } from "react";
import { PASTE_GUIDE_DURATION, PASTE_GUIDE_STEPS, type PasteGuidePart } from "@/lib/widgets/paste-guide-steps";
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
    <strong key={index} className="font-semibold">
      {part.strong}
    </strong>
  );

type PasteGuideStepsProps = { layout: "grid" | "column" };

/** The four steps, each with its drawing: side by side in the editor, one below the other on its own page. */
export const PasteGuideSteps = ({ layout }: PasteGuideStepsProps) => (
  <ol
    className={cn(
      layout === "grid" ? "grid grid-cols-[repeat(auto-fill,minmax(232px,1fr))] gap-5" : "flex flex-col",
    )}
  >
    {PASTE_GUIDE_STEPS.map((parts, index) => (
      <li
        key={index}
        className={cn(
          "flex flex-col gap-3",
          layout === "column" && "border-b border-hairline-200 py-5 first:pt-0",
        )}
      >
        <div className="border border-hairline-200 bg-paper-100">{DRAWINGS[index]}</div>
        <p className={layout === "grid" ? "text-small" : "text-body"}>
          <span className="font-semibold">{`${index + 1}.`}</span> {parts.map(renderPart)}
        </p>
      </li>
    ))}
  </ol>
);

/** Maquette 6, « Coller dans Systeme.io »: four illustrated steps under the editor, outlined once the code is copied. */
export const SystemePasteGuide = ({ isCodeCopied = false }: { isCodeCopied?: boolean }) => (
  <section
    aria-labelledby="paste-guide"
    className={cn(
      "flex flex-col gap-4 bg-white p-5 desktop:p-6",
      isCodeCopied ? "border-2 border-ink-900" : "border border-hairline-200",
    )}
  >
    <div className="flex flex-col gap-1 desktop:flex-row desktop:items-baseline desktop:justify-between desktop:gap-5">
      <h2 id="paste-guide" className="scroll-mt-5 font-serif text-quote font-medium">
        Coller dans Systeme.io
      </h2>
      <p className={cn("text-small", isCodeCopied ? "font-semibold text-success" : "text-slate-600")}>
        {isCodeCopied ? "Code copié, à vous de jouer" : PASTE_GUIDE_DURATION}
      </p>
    </div>
    <PasteGuideSteps layout="grid" />
  </section>
);
