import { WIDGET_PAYLOAD_VERSION, WIDGET_TYPES, type WidgetPayload } from "./payload";

const requests = new Map<string, Promise<WidgetPayload | null>>();

const isPayload = (value: unknown): value is WidgetPayload => {
  if (typeof value !== "object" || value === null) return false;
  const payload = value as Partial<WidgetPayload>;
  return (
    payload.v === WIDGET_PAYLOAD_VERSION &&
    WIDGET_TYPES.some((type) => type === payload.type) &&
    typeof payload.total === "number" &&
    Array.isArray(payload.testimonials) &&
    Array.isArray(payload.avatars)
  );
};

/** Two copies of the same widget on a page share one request. A failed request is tried again next time. */
export const loadWidgetPayload = (apiOrigin: string, widgetId: string, offset = 0): Promise<WidgetPayload | null> => {
  const url = `${apiOrigin}/api/widget/${encodeURIComponent(widgetId)}${offset > 0 ? `?offset=${offset}` : ""}`;
  const pending = requests.get(url);
  if (pending) return pending;

  const request = fetch(url, { mode: "cors", credentials: "omit" })
    .then((response) => (response.ok ? response.json() : null))
    .then((body: unknown) => (isPayload(body) ? body : null))
    .catch(() => null);
  requests.set(url, request);
  void request.then((payload) => {
    if (!payload) requests.delete(url);
  });
  return request;
};
