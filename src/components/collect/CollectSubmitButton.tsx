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
        "mb-1 h-[56px] w-full cursor-pointer rounded-lg border-2 text-body font-semibold",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900",
        isWaitingForPhoto
          ? "cursor-not-allowed border-hairline-200 bg-paper-100 text-slate-600"
          : "border-ink-900 bg-carmine text-white shadow-relief hover:bg-carmine-dark active:translate-y-1 active:shadow-none",
        isSubmitting && "translate-y-1 shadow-none",
      )}
    >
      Envoyer mon avis
    </button>
    {isWaitingForPhoto ? (
      <p className="text-center text-small text-slate-600">Le bouton revient dès que la photo est envoyée.</p>
    ) : null}
  </div>
);
