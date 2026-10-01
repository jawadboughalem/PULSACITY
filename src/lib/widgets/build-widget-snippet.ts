import { MOUNT_SELECTOR_ATTRIBUTE } from "../../../widget/src/mount-attribute";

/** What the creator pastes once in an HTML block of their sales page. */
export const buildWidgetSnippet = (appUrl: string, widgetId: string): string =>
  `<div ${MOUNT_SELECTOR_ATTRIBUTE}="${widgetId}"></div>\n<script src="${appUrl}/w.js" async></script>`;
