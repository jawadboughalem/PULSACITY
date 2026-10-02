import { MOUNT_SELECTOR_ATTRIBUTE, TYPE_HINT_ATTRIBUTE } from "../../../widget/src/mount-attribute";
import type { WidgetType } from "../../../widget/src/payload";

/**
 * The one line the creator pastes once in an HTML block of their sales page. The type only picks the loading state:
 * changed later in the editor, the widget still shows its new type without a new paste.
 */
export const buildWidgetSnippet = (appUrl: string, widget: { id: string; type: WidgetType }): string =>
  `<div ${MOUNT_SELECTOR_ATTRIBUTE}="${widget.id}" ${TYPE_HINT_ATTRIBUTE}="${widget.type}"></div><script async src="${appUrl}/w.js"></script>`;
