import { cn } from "@/lib/cn";

const STEPS = ["Choisir le fichier", "Vérifier", "Importer"] as const;

type ImportStepperProps = {
  current: 0 | 1 | 2;
};

/**
 * Charte v2, Étapes d'un formulaire: segments of 8, Encre up to the current step, Gris clair after; the current label in
 * bold, the next ones grey.
 */
export const ImportStepper = ({ current }: ImportStepperProps) => (
  <ol aria-label="Étapes de l'import" className="flex gap-2">
    {STEPS.map((label, index) => (
      <li
        key={label}
        aria-current={index === current ? "step" : undefined}
        className="flex flex-auto flex-col gap-3 text-small"
      >
        <span className={cn("h-[8px] rounded-full", index <= current ? "bg-ink" : "bg-gray-light")} />
        <span
          className={cn(
            index === current && "font-bold text-ink",
            index < current && "text-ink",
            index > current && "text-gray",
          )}
        >
          {label}
        </span>
      </li>
    ))}
  </ol>
);
