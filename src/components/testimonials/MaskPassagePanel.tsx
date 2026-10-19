"use client";

import { type ReactNode, useEffect, useRef, useState, useTransition } from "react";
import { maskTestimonialPassage } from "@/app/app/(espace)/temoignages/testimonial-actions";
import { DISCREET_BUTTON_CLASSES, SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { FieldError } from "@/components/ui/FieldError";
import { FIELD_HINT_CLASSES, FIELD_LABEL_CLASSES } from "@/components/ui/field-styles";
import {
  SEGMENTED_CLASSES,
  SEGMENTED_OPTION_CHOSEN_CLASSES,
  SEGMENTED_OPTION_CLASSES,
  SEGMENTED_OPTION_IDLE_CLASSES,
} from "@/components/ui/segmented-styles";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/cn";
import { NO_BREAK_SPACE } from "@/lib/french/typography";
import { type MaskedPassageKind, splitMaskedPassages } from "@/lib/testimonials/corrections/mask-passage";

type Selection = { start: number; end: number };

/** Charte v2, ajouts 3.4: a masked passage is a pill, Gris clair, its words Gris 700. */
export const MaskedPill = ({ text }: { text: string }) => (
  <span className="mx-[2px] inline-block rounded-full bg-gray-light px-3 text-small leading-[28px] font-bold text-gray">
    {text}
  </span>
);

/** A displayed text with its masked passages drawn as pills; each piece knows where it starts in the text. */
const renderPieces = (text: string, base: number): ReactNode[] => {
  let position = base;
  return splitMaskedPassages(text).map((part) => {
    const start = position;
    position += part.isMasked ? part.text.length + 2 : part.text.length;
    return part.isMasked ? (
      <span key={start} data-start={start} data-end={position} data-masked="" contentEditable={false}>
        <MaskedPill text={part.text} />
      </span>
    ) : (
      <span key={start} data-start={start} data-end={position}>
        {part.text}
      </span>
    );
  });
};

export const DisplayedText = ({ text }: { text: string }) => <>{renderPieces(text, 0)}</>;

/** Where a boundary of the browser's selection falls in the text: a masked pill is taken whole. */
const readOffset = (container: HTMLElement, node: Node, offset: number, side: "start" | "end"): number => {
  const element = node.nodeType === Node.TEXT_NODE ? node.parentElement : (node as HTMLElement);
  const piece = element?.closest<HTMLElement>("[data-start]");
  if (piece && container.contains(piece)) {
    const start = Number(piece.dataset.start);
    const end = Number(piece.dataset.end);
    if (piece.dataset.masked !== undefined) return side === "start" ? start : end;
    return node.nodeType === Node.TEXT_NODE ? start + offset : offset === 0 ? start : end;
  }
  const children = [...container.children] as HTMLElement[];
  if (offset === 0 || children.length === 0) return 0;
  return Number(children[Math.min(offset, children.length) - 1]?.dataset.end ?? 0);
};

/** A digit or an « @ » reads as a coordinate (a phone, an address); anything else as a name. */
const guessKind = (passage: string): MaskedPassageKind => (/[\d@]|www\.|https?:/.test(passage) ? "contact" : "name");

const ERRORS = {
  "empty-passage": "Sélectionnez d'abord le passage dans le texte.",
  "passage-too-long": `Choisissez un passage plus court${NO_BREAK_SPACE}: un nom ou une coordonnée, pas une phrase.`,
  "text-changed": "Le texte a changé entre-temps. Rechargez la page, puis réessayez.",
  "correction-waiting": "Une correction attend la réponse de l'auteur : patientez jusqu'à sa réponse.",
  "testimonial-not-found": "Ce témoignage n'existe plus. Rechargez la page.",
  "invalid-input": "Sélectionnez d'abord le passage dans le texte.",
  "not-saved": "Le passage n'a pas été masqué. Vérifiez votre connexion, puis réessayez.",
} as const;

type MaskPassagePanelProps = {
  testimonialId: string;
  text: string;
  onMasked: () => void;
  onCancel: () => void;
};

/**
 * Maquettes 3.4, fiche 12, « Masquer un nom ou une coordonnée »: the creator selects the passage in the text, says
 * what it is, and it is replaced in the displayed text only. No agreement needed: the original stays as written.
 */
export const MaskPassagePanel = ({ testimonialId, text, onMasked, onCancel }: MaskPassagePanelProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [kind, setKind] = useState<MaskedPassageKind>("name");
  const [error, setError] = useState<keyof typeof ERRORS | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const read = () => {
      const container = containerRef.current;
      const current = document.getSelection();
      if (!container || !current || current.rangeCount === 0) return;
      const range = current.getRangeAt(0);
      const isInside = container.contains(range.startContainer) && container.contains(range.endContainer);
      if (!isInside || range.collapsed) {
        setIsSelecting(false);
        return;
      }
      const start = readOffset(container, range.startContainer, range.startOffset, "start");
      const end = readOffset(container, range.endContainer, range.endOffset, "end");
      if (end <= start) return;
      setIsSelecting(true);
      setSelection({ start, end });
      setKind(guessKind(text.slice(start, end)));
      setError(null);
    };
    document.addEventListener("selectionchange", read);
    return () => document.removeEventListener("selectionchange", read);
  }, [text]);

  const mask = () => {
    if (!selection) {
      setError("empty-passage");
      return;
    }
    startTransition(async () => {
      try {
        const result = await maskTestimonialPassage(testimonialId, { text, ...selection, kind });
        if (result.ok) onMasked();
        else setError(result.error);
      } catch {
        setError("not-saved");
      }
    });
  };

  // While the browser holds a selection inside the text, the text is not redrawn, or the selection would be lost.
  const shown =
    selection && !isSelecting ? (
      <>
        {renderPieces(text.slice(0, selection.start), 0)}
        <mark className="rounded-[6px] border-2 border-ink bg-sun text-ink [box-decoration-break:clone]">
          {renderPieces(text.slice(selection.start, selection.end), selection.start)}
        </mark>
        {renderPieces(text.slice(selection.end), selection.end)}
      </>
    ) : (
      renderPieces(text, 0)
    );

  return (
    <div className="flex flex-col gap-6 rounded-card border-2 border-ink p-5 desktop:p-8">
      <div className="flex flex-col gap-3">
        <h3 className="font-display text-h3">Masquer un nom ou une coordonnée</h3>
        <p className={FIELD_HINT_CLASSES}>
          Sélectionnez le passage dans le texte, puis dites ce que c&apos;est. Il est remplacé à l&apos;affichage ;
          l&apos;original reste gardé. Aucun accord n&apos;est nécessaire.
        </p>
      </div>
      <div
        ref={containerRef}
        className="px-2 text-quote whitespace-pre-line text-ink selection:bg-sun desktop:px-6"
        aria-label="Texte affiché : sélectionnez le passage à masquer"
      >
        {shown}
      </div>
      <div className="flex flex-col gap-3">
        <p id="masked-kind-label" className={FIELD_LABEL_CLASSES}>
          Le passage choisi est
        </p>
        <div role="group" aria-labelledby="masked-kind-label" className={cn(SEGMENTED_CLASSES, "self-stretch desktop:self-start")}>
          {(
            [
              ["name", "Un nom"],
              ["contact", "Une coordonnée"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={kind === value}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => setKind(value)}
              className={cn(
                SEGMENTED_OPTION_CLASSES,
                kind === value ? SEGMENTED_OPTION_CHOSEN_CLASSES : SEGMENTED_OPTION_IDLE_CLASSES,
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      {error ? (
        <div role="alert">
          <FieldError id="mask-passage-error" message={ERRORS[error]} />
        </div>
      ) : null}
      <div className="flex flex-col gap-3 desktop:flex-row desktop:items-center desktop:gap-6">
        <button
          type="button"
          onClick={mask}
          aria-busy={isPending || undefined}
          className={cn(SECONDARY_BUTTON_CLASSES, "w-full desktop:w-auto")}
        >
          {isPending ? <Spinner size={18} /> : null}
          {isPending ? "Envoi…" : "Masquer ce passage"}
        </button>
        <button type="button" onClick={onCancel} disabled={isPending} className={cn(DISCREET_BUTTON_CLASSES, "self-center desktop:self-auto")}>
          Annuler
        </button>
      </div>
    </div>
  );
};
