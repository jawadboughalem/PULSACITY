"use client";

import { useEffect, useId, useRef, useState } from "react";
import { PRIMARY_BUTTON_CLASSES, SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { DialogCloseButton } from "@/components/ui/DialogCloseButton";
import { DIALOG_ACTIONS_CLASSES, DIALOG_CLASSES, DIALOG_TITLE_CLASSES, isClickOnVeil } from "@/components/ui/dialog-styles";
import { Icon } from "@/components/ui/Icon";
import {
  SEGMENTED_CLASSES,
  SEGMENTED_OPTION_CHOSEN_CLASSES,
  SEGMENTED_OPTION_CLASSES,
  SEGMENTED_OPTION_IDLE_CLASSES,
} from "@/components/ui/segmented-styles";
import { cn } from "@/lib/cn";

type ImageFormat = "portrait" | "paysage";

const FORMATS: Array<{ value: ImageFormat; label: string; width: number; height: number }> = [
  { value: "portrait", label: "Portrait 1080 × 1350", width: 1080, height: 1350 },
  { value: "paysage", label: "Paysage 1200 × 630", width: 1200, height: 630 },
];

type ShareTestimonialDialogProps = {
  testimonialId: string;
  /** « Camille R. »: « Partager le témoignage de Camille ». */
  authorName: string;
  hasPurchase: boolean;
};

const firstName = (authorName: string) => authorName.split(/\s+/)[0] ?? authorName;

/**
 * Maquettes 3.6, « Partager » on the page of a validated testimonial: the format, its image as it will download, then
 * « Télécharger l'image ». Only a validated testimonial, whose client accepted the publication, is shared.
 */
export const ShareTestimonialButton = ({ testimonialId, authorName, hasPurchase }: ShareTestimonialDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [format, setFormat] = useState<ImageFormat>("portrait");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const imageUrl = (download: boolean) =>
    `/app/temoignages/${testimonialId}/image?format=${format}${download ? "&telecharger=1" : ""}`;
  const chosen = FORMATS.find((option) => option.value === format) ?? FORMATS[0];
  const name = firstName(authorName);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={cn(SECONDARY_BUTTON_CLASSES, "w-full desktop:order-0 desktop:w-auto")}
      >
        <Icon name="share" size={20} />
        Partager
      </button>
      <dialog
        ref={dialogRef}
        data-ouvert={isOpen}
        onCancel={(event) => {
          event.preventDefault();
          setIsOpen(false);
        }}
        onClick={(event) => {
          if (isClickOnVeil(event)) setIsOpen(false);
        }}
        aria-labelledby={titleId}
        className={cn(DIALOG_CLASSES, "desktop:max-w-[600px]")}
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-4">
              <h2 id={titleId} className={DIALOG_TITLE_CLASSES}>
                {`Partager le témoignage de ${name}`}
              </h2>
              <DialogCloseButton onClick={() => setIsOpen(false)} />
            </div>
            <p className="text-body">Une image aux couleurs de votre espace, à publier sur vos réseaux.</p>
          </div>
          <div role="radiogroup" aria-label="Format de l'image" className={SEGMENTED_CLASSES}>
            {FORMATS.map((option) => (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={format === option.value}
                onClick={() => setFormat(option.value)}
                className={cn(
                  SEGMENTED_OPTION_CLASSES,
                  "px-3 max-desktop:text-small",
                  format === option.value ? SEGMENTED_OPTION_CHOSEN_CLASSES : SEGMENTED_OPTION_IDLE_CLASSES,
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
          {isOpen ? (
            <div className="flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element -- the image of the route, as it will download */}
              <img
                key={format}
                src={imageUrl(false)}
                alt={`Aperçu de l'image ${chosen.label}`}
                width={chosen.width}
                height={chosen.height}
                className={cn(
                  "h-auto rounded-field bg-cloud",
                  format === "portrait" ? "w-[220px] desktop:w-[305px]" : "w-full",
                )}
              />
            </div>
          ) : null}
          <p className="text-small text-gray">
            {`Seuls les témoignages validés se partagent : ${name} a accepté leur publication. ${
              hasPurchase ? "Date de l'avis et mois de l'achat inclus." : "Date de l'avis incluse."
            }`}
          </p>
          <div className={DIALOG_ACTIONS_CLASSES}>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className={cn(SECONDARY_BUTTON_CLASSES, "w-full desktop:w-auto")}
            >
              Annuler
            </button>
            <a href={imageUrl(true)} download className={cn(PRIMARY_BUTTON_CLASSES, "w-full desktop:w-auto")}>
              <Icon name="download" size={20} />
              Télécharger l&apos;image
            </a>
          </div>
        </div>
      </dialog>
    </>
  );
};
