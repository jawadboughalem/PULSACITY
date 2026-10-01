import type { Metadata } from "next";
import { BackBar } from "@/components/space/BackBar";
import { MORE_SECTION_HREF } from "@/components/space/space-sections";
import { SpacePage } from "@/components/space/SpacePage";
import { WidgetList } from "@/components/widgets/WidgetList";
import { canCreateWidget, getPlan } from "@/config/plans";
import { getDb } from "@/db";
import { formatDayMonthYear } from "@/lib/dates/format-french-date";
import { getCurrentSpace } from "@/lib/spaces/get-current-space";
import { listSpaceWidgets } from "@/lib/widgets/space-widgets";

export const metadata: Metadata = {
  title: "Widgets · PULSACITY",
};

const WidgetsPage = async () => {
  const { space } = await getCurrentSpace();
  const widgets = await listSpaceWidgets(getDb(), space.id);

  return (
    <>
      <BackBar href={MORE_SECTION_HREF} label="Plus" />
      <SpacePage className="desktop:max-w-[1128px]">
        <WidgetList
          widgets={widgets.map((widget) => ({
            id: widget.id,
            type: widget.type,
            offerName: widget.productName,
            shownSince: widget.firstLoadedAt
              ? `Sur une page depuis le ${formatDayMonthYear(widget.firstLoadedAt)}`
              : null,
          }))}
          canCreate={canCreateWidget(space, widgets.length)}
          planName={getPlan(space.plan).name}
        />
      </SpacePage>
    </>
  );
};

export default WidgetsPage;
