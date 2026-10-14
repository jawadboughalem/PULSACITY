import { cn } from "@/lib/cn";

const STEPS = ["Choisir le fichier", "Vérifier", "Importer"] as const;

type ImportStepperProps = {
  current: 0 | 1 | 2;
};

/** The three steps of the import: done in Ink, the current one in bold, the next ones grey. */
export const ImportStepper = ({ current }: ImportStepperProps) => (
  <ol aria-label="Étapes de l'import" className="flex gap-1">
    {STEPS.map((label, index) => (
      <li
        key={label}
        aria-current={index === current ? "step" : undefined}
        className="flex flex-auto flex-col gap-3 text-small"
      >
        <span className={cn("h-[4px] rounded-full", index <= current ? "bg-ink" : "bg-sky")} />
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
