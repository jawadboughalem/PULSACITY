import { cn } from "@/lib/cn";

export const EXAMPLE_MENTION = "Exemple, avis fictifs";

type ExampleMentionProps = {
  /** On Soleil, every text is Encre (charte v2, Combinaisons interdites). */
  isOnSun?: boolean;
  className?: string;
};

/** Under every example of the site (charte v2, Captures et illustrations; positionnement.md): 13/18. */
export const ExampleMention = ({ isOnSun = false, className }: ExampleMentionProps) => (
  <p className={cn("text-legal font-semibold", isOnSun ? "text-ink" : "text-gray", className)}>{EXAMPLE_MENTION}</p>
);
