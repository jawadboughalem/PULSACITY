const FOCUS_RING = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900";

const DISABLED =
  "disabled:cursor-not-allowed disabled:border disabled:border-hairline-200 disabled:bg-paper-100 disabled:text-slate-600";

export const PRIMARY_BUTTON_CLASSES = `inline-flex h-[48px] items-center justify-center gap-2 rounded-sm bg-ink-900 px-5 text-body font-semibold text-white hover:bg-ink-800 ${FOCUS_RING} ${DISABLED}`;

export const SECONDARY_BUTTON_CLASSES = `inline-flex h-[48px] items-center justify-center gap-2 rounded-sm border border-ink-900 bg-white px-5 text-body font-semibold text-ink-900 hover:bg-paper-100 ${FOCUS_RING} ${DISABLED}`;

export const DISCREET_BUTTON_CLASSES = `inline-flex min-h-[48px] items-center gap-2 px-1 text-body font-semibold text-carmine underline-offset-[3px] hover:text-carmine-dark hover:underline ${FOCUS_RING}`;
