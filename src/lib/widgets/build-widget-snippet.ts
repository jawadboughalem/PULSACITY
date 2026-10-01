import { MOUNT_SELECTOR_ATTRIBUTE } from "../../../widget/src/mount-attribute";

/** The one line the creator pastes once in an HTML block of their sales page. */
export const buildWidgetSnippet = (appUrl: string, widgetId: string): string =>
  `<div ${MOUNT_SELECTOR_ATTRIBUTE}="${widgetId}"></div><script async src="${appUrl}/w.js"></script>`;
