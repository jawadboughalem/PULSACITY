import type { Metadata } from "next";
import { BackBar } from "@/components/space/BackBar";
import { MORE_SECTION_HREF } from "@/components/space/space-sections";
import { SpacePage } from "@/components/space/SpacePage";
import { describeWidget } from "@/components/widgets/describe-widget";
import { type CreateLimit, type WidgetDisplay, WidgetList } from "@/components/widgets/WidgetList";
import { canCreateWidget, getPlan } from "@/config/plans";
import { readPlanPrice } from "@/content/plan-offer";
import { getDb } from "@/db";
import { readCurrentPriceList } from "@/lib/billing/founder-seats";
import { formatDayMonthYear } from "@/lib/dates/format-french-date";
import { getCurrentSpace } from "@/lib/spaces/get-current-space";
import { type RankedWidget, listRankedWidgets, readDisplayedWidgetIds } from "@/lib/widgets/free-plan-widgets";
import { listSpaceWidgets } from "@/lib/widgets/space-widgets";

export const metadata: Metadata = {
  title: "Widgets · PULSACITY",
};

const formatMonthlyPrice = (cents: number) => `${new Intl.NumberFormat("fr-FR").format(cents / 100)} € par mois`;

/** Since when the paused widgets are: the return to the free plan, or the last « Afficher celui-ci à la place ». */
const readPausedSince = (freeSince: Date | null, shown: RankedWidget[]): Date | null =>
  [freeSince, ...shown.map((widget) => widget.freePlanChosenAt)].reduce<Date | null>(
    (latest, date) => (date !== null && (latest === null || date > latest) ? date : latest),
    null,
  );

const describeShown = (shownSince: string | null, isChosen: boolean): string =>
  `${shownSince ?? "Pas encore collé sur une page"}. ${isChosen ? "Vous l'avez choisi" : "C'est le plus ancien"} : il reste affiché.`;

const describePaused = (pausedSince: Date | null): string =>
  `${pausedSince === null ? "En pause" : `En pause depuis le ${formatDayMonthYear(pausedSince)}`} : il ne s'affiche plus sur votre page, et rien ne bouge à sa place.`;

const WidgetsPage = async () => {
  const { space } = await getCurrentSpace();
  const database = getDb();
  const [widgets, ranked, priceList] = await Promise.all([
    listSpaceWidgets(database, space.id),
    listRankedWidgets(database, space.id),
    readCurrentPriceList(database),
  ]);
  const plan = getPlan(space.plan);
  const createLimit: CreateLimit | null =
    canCreateWidget(space, widgets.length) || plan.limits.widgets === null
      ? null
      : {
          planName: plan.name,
          widgetLimit: plan.limits.widgets,
          nextPlanPrice: formatMonthlyPrice(readPlanPrice("essentiel", "monthly", priceList)),
        };
  // Back on the free plan with more widgets than it allows: one shows, the others are paused (decisions/tarifs.md).
  const displayed = readDisplayedWidgetIds(ranked, plan.limits.widgets);
  const isPausing = displayed.size < ranked.length;
  const pausedSince = readPausedSince(space.freeSince, ranked.filter((widget) => displayed.has(widget.id)));

  const describeDisplay = (widget: { id: string; firstLoadedAt: Date | null }): WidgetDisplay => {
    if (!displayed.has(widget.id)) return { state: "paused", note: describePaused(pausedSince) };
    const shownSince = widget.firstLoadedAt ? `Sur une page depuis le ${formatDayMonthYear(widget.firstLoadedAt)}` : null;
    const isChosen = Boolean(ranked.find((candidate) => candidate.id === widget.id)?.freePlanChosenAt);
    return { state: "shown", note: describeShown(shownSince, isChosen) };
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
              display: isPausing ? describeDisplay(widget) : null,
            };
          })}
          createLimit={createLimit}
          isPausing={isPausing}
        />
      </SpacePage>
    </>
  );
};

export default WidgetsPage;
