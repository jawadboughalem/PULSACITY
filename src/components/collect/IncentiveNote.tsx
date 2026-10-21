import { Icon } from "@/components/ui/Icon";
import { BETA_TESTER_MENTION } from "@/config/pulsacity-space";
import { NO_BREAK_SPACE } from "@/lib/french/typography";

/** « declared »: the space's counterpart (Réglages); « beta »: PULSACITY's page for its beta testers. */
export type CollectionIncentive = "declared" | "beta";

const describeIncentive = (incentive: CollectionIncentive, spaceName: string) =>
  incentive === "beta"
    ? `Vous avez reçu le plan Essentiel pendant la bêta. Votre avis publié portera la mention «${NO_BREAK_SPACE}${BETA_TESTER_MENTION}${NO_BREAK_SPACE}».`
    : `${spaceName} offre une contrepartie pour chaque avis, quel qu'il soit. Elle est indiquée avec les avis publiés.`;

/**
 * Maquettes 3.6, collecte 10 et 11 (positionnement.md, point 7): before the form, so the customer knows before writing.
 * Charte v2, ajouts 3.6: an aplat #F2F4F8, the gift icon 20, 15/22. The texts are Design's proposal.
 */
export const IncentiveNote = ({ incentive, spaceName }: { incentive: CollectionIncentive; spaceName: string }) => (
  <p className="flex items-start gap-3 rounded-card bg-widget-light-card px-4 py-3 text-small">
    <Icon name="gift" size={20} className="mt-[1px] shrink-0" />
    {describeIncentive(incentive, spaceName)}
  </p>
);
