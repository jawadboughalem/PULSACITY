import Link from "next/link";
import { BETA_OFFERED_MONTHS } from "@/config/pulsacity-space";
import { cn } from "@/lib/cn";
import { MARKETING_PATHS } from "../marketing-paths";
import { SITE_SECTION_TITLE_CLASSES, TEXT_LINK_CLASSES } from "../marketing-styles";

/**
 * Maquettes 3.5, Accueil, section 10 (positionnement.md, with arbitrages.md n° 3): no invented review, and the beta's
 * offer, on a Soleil block. Every text on Soleil is Encre.
 */
export const FirstCreators = () => (
  <div className="flex flex-col items-start gap-4 rounded-block bg-sun p-6 desktop:gap-6 desktop:px-12 desktop:py-12">
    <h2 id="first-creators" className={cn(SITE_SECTION_TITLE_CLASSES, "desktop:max-w-[800px]")}>
      PULSACITY est nouveau. Vous ne verrez ici aucun avis inventé.
    </h2>
    <p className="max-w-[800px] text-lead">
      {`Les premiers témoignages de PULSACITY arriveront comme les vôtres : par PULSACITY, après une vraie vente. Vous voulez être parmi les premiers créateurs ? Écrivez-nous : nous offrons le plan Essentiel pendant ${BETA_OFFERED_MONTHS} mois à nos premiers testeurs, en échange de leurs remarques sur le produit.`}
    </p>
    <Link href={MARKETING_PATHS.contact} className={cn(TEXT_LINK_CLASSES, "-ml-[10px] active:bg-sun-pressed")}>
      Écrivez-nous
    </Link>
  </div>
);
