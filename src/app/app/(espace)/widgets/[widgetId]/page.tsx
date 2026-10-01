import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";
import { BackBar } from "@/components/space/BackBar";
import { WIDGETS_SECTION_HREF } from "@/components/space/space-sections";
import { WidgetEditor } from "@/components/widgets/WidgetEditor";
import { canHideBadge } from "@/config/plans";
import { getDb } from "@/db";
import { getAppUrl } from "@/lib/app-url";
import { getCurrentSpace } from "@/lib/spaces/get-current-space";
import { listSpaceProducts } from "@/lib/spaces/list-space-products";
import { buildReferralUrl } from "@/lib/widgets/build-widget-payload";
import { buildWidgetSnippet } from "@/lib/widgets/build-widget-snippet";
import { loadWidgetPreview } from "@/lib/widgets/load-widget-preview";
import { findOwnedWidget } from "@/lib/widgets/space-widgets";
import { resolveWidgetSettings, toEditableWidget } from "@/lib/widgets/widget-settings";

export const metadata: Metadata = {
  title: "Modifier le widget · PULSACITY",
};

const WidgetEditorPage = async ({ params }: PageProps<"/app/widgets/[widgetId]">) => {
  const { widgetId } = await params;
  const { signedInUser, space } = await getCurrentSpace();
  if (!z.uuid().safeParse(widgetId).success) notFound();
  const database = getDb();
  const widget = await findOwnedWidget(database, signedInUser.id, widgetId);
  if (!widget) notFound();

  const [offers, preview] = await Promise.all([
    listSpaceProducts(database, space.id),
    loadWidgetPreview(database, space.id),
  ]);
  const appUrl = getAppUrl();

  return (
    <>
      <BackBar href={WIDGETS_SECTION_HREF} label="Widgets" />
      <main className="flex min-w-[0] flex-col">
        <WidgetEditor
          widget={toEditableWidget(widget)}
          offers={offers.map(({ id, name }) => ({ id, name }))}
          preview={preview}
          look={{
            cardStyle: resolveWidgetSettings(widget.settings).cardStyle,
            spaceAccentColor: space.accentColor,
            poweredByUrl: buildReferralUrl(appUrl, space.referralCode),
            canHideBadge: canHideBadge(space),
          }}
          spaceName={space.name}
          snippet={buildWidgetSnippet(appUrl, widget.id)}
        />
      </main>
    </>
  );
};

export default WidgetEditorPage;
