import type { Metadata } from "next";
import { BackBar } from "@/components/space/BackBar";
import { MORE_SECTION_HREF } from "@/components/space/space-sections";
import { SpacePage } from "@/components/space/SpacePage";
import { describeWidget } from "@/components/widgets/describe-widget";
import { type CreateLimit, WidgetList } from "@/components/widgets/WidgetList";
import { canCreateWidget, getPlan } from "@/config/plans";
import { getDb } from "@/db";
import { formatDayMonthYear } from "@/lib/dates/format-french-date";
import { getCurrentSpace } from "@/lib/spaces/get-current-space";
import { listSpaceWidgets } from "@/lib/widgets/space-widgets";

export const metadata: Metadata = {
  title: "Widgets · PULSACITY",
};

const formatMonthlyPrice = (cents: number) => `${new Intl.NumberFormat("fr-FR").format(cents / 100)} € HT par mois`;

const WidgetsPage = async () => {
  const { space } = await getCurrentSpace();
  const widgets = await listSpaceWidgets(getDb(), space.id);
  const plan = getPlan(space.plan);
  const createLimit: CreateLimit | null =
    canCreateWidget(space, widgets.length) || plan.limits.widgets === null
      ? null
      : {
          planName: plan.name,
          widgetLimit: plan.limits.widgets,
          nextPlanPrice: formatMonthlyPrice(getPlan("essentiel").priceCents.monthly),
        };

  return (
    <>
      <BackBar href={MORE_SECTION_HREF} label="Plus" />
      <SpacePage className="desktop:max-w-[1128px]">
        <WidgetList
          widgets={widgets.map((widget) => {
            const description = describeWidget(widget.type, widget.productName);
            return {
              id: widget.id,
              type: widget.type,
              title: widget.name ?? description,
              description,
              shownSince: widget.firstLoadedAt
                ? `Sur une page depuis le ${formatDayMonthYear(widget.firstLoadedAt)}`
                : null,
            };
          })}
          createLimit={createLimit}
        />
      </SpacePage>
    </>
  );
};

export default WidgetsPage;
