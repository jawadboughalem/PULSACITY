import * as Sentry from "@sentry/nextjs";
import { after } from "next/server";
import { z } from "zod";
import { getDb } from "@/db";
import { getAppUrl } from "@/lib/app-url";
import { loadWidgetPayload, markWidgetFirstLoaded } from "@/lib/widgets/load-widget-payload";

const MAX_OFFSET = 10_000;

/** Any page may read a widget: the answer holds only what the widget displays. */
const READABLE_EVERYWHERE = { "Access-Control-Allow-Origin": "*" };

/** A minute at the edge, then the stale answer keeps being served while a fresh one is fetched. */
const EDGE_CACHE = "public, max-age=0, s-maxage=60, stale-while-revalidate=86400";

const NO_CACHE = "no-store";

const offsetSchema = z.coerce.number().int().min(0).max(MAX_OFFSET);

const answer = (body: unknown, status: number, cacheControl: string) =>
  Response.json(body, { status, headers: { ...READABLE_EVERYWHERE, "Cache-Control": cacheControl } });

const readOffset = (url: string): number | null => {
  const value = new URL(url).searchParams.get("offset");
  if (value === null) return 0;
  const parsed = offsetSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
};

/** A fetch from a page other than PULSACITY itself: the widget is pasted somewhere. */
const isPastedPage = (origin: string | null, appUrl: string): boolean => {
  if (!origin) return false;
  try {
    const url = new URL(origin);
    return (url.protocol === "https:" || url.protocol === "http:") && url.origin !== new URL(appUrl).origin;
  } catch {
    return false;
  }
};

export const GET = async (request: Request, { params }: RouteContext<"/api/widget/[widgetId]">): Promise<Response> => {
  const { widgetId } = await params;
  if (!z.uuid().safeParse(widgetId).success) return answer({ error: "not-found" }, 404, EDGE_CACHE);
  const offset = readOffset(request.url);
  if (offset === null) return answer({ error: "invalid-offset" }, 400, EDGE_CACHE);

  const database = getDb();
  const appUrl = getAppUrl();
  let loaded: Awaited<ReturnType<typeof loadWidgetPayload>>;
  try {
    loaded = await loadWidgetPayload(database, widgetId, { appUrl, offset });
  } catch (error) {
    Sentry.captureException(error);
    return answer({ error: "unavailable" }, 503, NO_CACHE);
  }
  if (!loaded) return answer({ error: "not-found" }, 404, EDGE_CACHE);

  if (loaded.firstLoadedAt === null && isPastedPage(request.headers.get("origin"), appUrl)) {
    after(async () => {
      try {
        await markWidgetFirstLoaded(database, widgetId);
      } catch (error) {
        Sentry.captureException(error);
      }
    });
  }
  return answer(loaded.payload, 200, EDGE_CACHE);
};

export const OPTIONS = (): Response =>
  new Response(null, {
    status: 204,
    headers: { ...READABLE_EVERYWHERE, "Access-Control-Allow-Methods": "GET, OPTIONS", "Access-Control-Max-Age": "86400" },
  });
