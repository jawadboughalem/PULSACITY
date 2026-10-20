import type { CSSProperties } from "react";
import { FOCUS_RING } from "@/components/ui/button-styles";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/cn";
import { readAccentButtonColors } from "@/lib/colors/accent-button-colors";

type CollectSubmitButtonProps = {
  accentColor: string | null;
  isSubmitting: boolean;
  isWaitingForPhoto: boolean;
};

type AccentStyle = CSSProperties & { "--accent": string; "--accent-hover": string; "--accent-text": string };

/**
 * Charte v2, Bouton de la page de collecte: full width, 60 high, a pill without shadow, Figtree 700 18. Its background
 * is the creator's accent (Réglages), its text white if it reaches 4.5:1, otherwise Encre; hovered, the accent darkened
 * by 8 %. Without an accent: Soleil and Encre. While it sends: the spinner and « Envoi… ».
 */
export const CollectSubmitButton = ({ accentColor, isSubmitting, isWaitingForPhoto }: CollectSubmitButtonProps) => {
  const accent = readAccentButtonColors(accentColor);
  const accentStyle: AccentStyle | undefined = accent
    ? { "--accent": accent.background, "--accent-hover": accent.hover, "--accent-text": accent.text }
    : undefined;

  return (
    <div className="flex flex-col gap-2">
      <button
        type="submit"
        disabled={isSubmitting || isWaitingForPhoto}
        aria-busy={isSubmitting || undefined}
        style={isWaitingForPhoto ? undefined : accentStyle}
        className={cn(
          "pz-couleur pz-appui inline-flex h-[60px] w-full cursor-pointer items-center justify-center gap-2 rounded-full text-[18px] font-bold",
          FOCUS_RING,
          isWaitingForPhoto
            ? "cursor-not-allowed bg-gray-light text-gray"
            : accent
              ? "bg-(--accent) text-(--accent-text) hover:bg-(--accent-hover) active:bg-(--accent-hover)"
              : "bg-sun text-ink hover:bg-sun-hover active:bg-sun-pressed",
          isSubmitting && "cursor-progress",
        )}
      >
        {isSubmitting ? (
          <>
            <Spinner size={20} />
            Envoi…
          </>
        ) : (
          "Envoyer mon avis"
        )}
      </button>
      {isWaitingForPhoto ? (
        <p className="text-center text-small text-gray">Le bouton revient dès que la photo est envoyée.</p>
      ) : null}
    </div>
  );
};
