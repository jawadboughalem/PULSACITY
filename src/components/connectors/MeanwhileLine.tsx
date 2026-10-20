import Link from "next/link";
import { INLINE_LINK_CLASSES } from "@/components/ui/button-styles";
import { type UpcomingIntegration, readMeanwhileLinks } from "@/content/integrations";
import { cn } from "@/lib/cn";

const MEANWHILE_LINK_CLASSES = cn(INLINE_LINK_CLASSES, "font-bold");

type MeanwhileLineProps = {
  integration: UpcomingIntegration;
  className?: string;
};

/**
 * Charte v2, Carte d'outil: « En attendant : avec Zapier ou Make », each name leading to its guide, or « Déjà possible
 * avec le connecteur universel : voir le guide » for a tool a guide already serves. 14/20 Gris.
 */
export const MeanwhileLine = ({ integration, className }: MeanwhileLineProps) => {
  const links = readMeanwhileLinks(integration);
  return (
    <p className={cn("text-badge text-gray", className)}>
      {"guideHref" in links ? (
        <>
          {"Déjà possible avec le connecteur universel : "}
          <Link href={links.guideHref} className={MEANWHILE_LINK_CLASSES}>
            voir le guide
          </Link>
        </>
      ) : (
        <>
          {"En attendant : avec "}
          <Link href={links.zapierHref} className={MEANWHILE_LINK_CLASSES}>
            Zapier
          </Link>
          {" ou "}
          <Link href={links.makeHref} className={MEANWHILE_LINK_CLASSES}>
            Make
          </Link>
        </>
      )}
    </p>
  );
};
