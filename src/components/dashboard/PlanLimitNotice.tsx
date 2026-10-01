import Link from "next/link";
import { BILLING_HREF } from "@/components/space/space-sections";
import { DISCREET_BUTTON_CLASSES, SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/Icon";
import { snoozePlanLimitNotice } from "./plan-limit-notice-actions";

type PlanLimitNoticeProps = {
  planName: string;
  testimonialLimit: number;
  pendingCount: number;
};

export const PlanLimitNotice = ({ planName, testimonialLimit, pendingCount }: PlanLimitNoticeProps) => (
  <section role="status" className="flex items-start gap-3 bg-paper-100 p-5 desktop:gap-4 desktop:p-6">
    <Icon name="info" size={24} className="shrink-0" />
    <div className="flex flex-col gap-2">
      <h2 className="text-body font-semibold">
        {`Vous avez atteint ${testimonialLimit} témoignages, le maximum du plan ${planName}.`}
      </h2>
      <p className="text-small">
        {pendingCount > 0
          ? `Rien n'est supprimé. Les nouveaux témoignages continuent d'arriver et restent en attente : ${pendingCount} pour l'instant. Avec le plan Essentiel, ils s'affichent tous, sans limite.`
          : "Rien n'est supprimé. Les nouveaux témoignages continuent d'arriver et restent en attente. Avec le plan Essentiel, ils s'affichent tous, sans limite."}
      </p>
      <div className="flex flex-col items-start gap-2 pt-3 desktop:flex-row desktop:items-center desktop:gap-5">
        <Link href={BILLING_HREF} className={SECONDARY_BUTTON_CLASSES}>
          Voir le plan Essentiel
        </Link>
        <form action={snoozePlanLimitNotice}>
          <button type="submit" className={DISCREET_BUTTON_CLASSES}>
            Plus tard
          </button>
        </form>
      </div>
    </div>
  </section>
);
