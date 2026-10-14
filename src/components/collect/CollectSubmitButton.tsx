import { FOCUS_RING } from "@/components/ui/button-styles";
import { cn } from "@/lib/cn";

type CollectSubmitButtonProps = {
  isSubmitting: boolean;
  isWaitingForPhoto: boolean;
};

/**
 * Charte v2, Bouton de la page de collecte: full width, 60 high, a pill without shadow, Figtree 700 18. The space has no
 * accent on this page yet: Soleil and Encre, the charter's colours without an accent.
 */
export const CollectSubmitButton = ({ isSubmitting, isWaitingForPhoto }: CollectSubmitButtonProps) => (
  <div className="flex flex-col gap-2">
    <button
      type="submit"
      disabled={isSubmitting || isWaitingForPhoto}
      aria-busy={isSubmitting || undefined}
      className={cn(
        "pz-couleur pz-appui h-[60px] w-full cursor-pointer rounded-full text-[18px] font-bold",
        FOCUS_RING,
        isWaitingForPhoto
          ? "cursor-not-allowed bg-gray-light text-gray"
          : "bg-sun text-ink hover:bg-sun-hover active:bg-sun-pressed",
        isSubmitting && "cursor-progress",
      )}
    >
      Envoyer mon avis
    </button>
    {isWaitingForPhoto ? (
      <p className="text-center text-small text-gray">Le bouton revient dès que la photo est envoyée.</p>
    ) : null}
  </div>
);
