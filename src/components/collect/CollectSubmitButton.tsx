import { cn } from "@/lib/cn";

type CollectSubmitButtonProps = {
  isSubmitting: boolean;
  isWaitingForPhoto: boolean;
};

export const CollectSubmitButton = ({ isSubmitting, isWaitingForPhoto }: CollectSubmitButtonProps) => (
  <div className="flex flex-col gap-2">
    <button
      type="submit"
      disabled={isSubmitting || isWaitingForPhoto}
      aria-busy={isSubmitting || undefined}
      className={cn(
        "mb-1 h-[56px] w-full cursor-pointer rounded-card border-2 text-body font-bold",
        "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ink",
        isWaitingForPhoto
          ? "cursor-not-allowed border-hairline-200 bg-sky text-gray"
          : "border-ink bg-carmine text-white hover:bg-carmine-dark active:translate-y-1 active:shadow-none",
        isSubmitting && "translate-y-1 shadow-none",
      )}
    >
      Envoyer mon avis
    </button>
    {isWaitingForPhoto ? (
      <p className="text-center text-small text-gray">Le bouton revient dès que la photo est envoyée.</p>
    ) : null}
  </div>
);
