/** The welcome e-mails (maquettes 3.6), one per step, each sent the day of its name after the space was created. */
export const WELCOME_EMAIL_STEPS = ["j0", "j1", "j3", "j7"] as const;

export type WelcomeEmailStep = (typeof WELCOME_EMAIL_STEPS)[number];

/** Days after the creation of the space. J0 leaves at once; the others at 10 a.m. in Paris that day. */
export const WELCOME_EMAIL_DAYS: Record<WelcomeEmailStep, number> = { j0: 0, j1: 1, j3: 3, j7: 7 };

/** The hour, in Paris, of J1, J3 and J7 (the maquettes show 10:00). */
export const WELCOME_EMAIL_HOUR = 10;

/**
 * Past this delay after its time, an e-mail is no longer sent: a late task, or a space created before the e-mails
 * existed, never receives a burst of old e-mails. Two days: the daily safety-net run (Vercel Cron) always falls inside.
 */
export const WELCOME_EMAIL_LATENESS_MS = 2 * 24 * 60 * 60 * 1000;
