type Tracker = { track: (event: string, data?: Record<string, string>) => void };

/** An event sent by code (the sign-up link asked for), when the audience tracker is loaded; nothing otherwise. */
export const trackEvent = (name: string, data?: Record<string, string>): void => {
  (window as Window & { umami?: Tracker }).umami?.track(name, data);
};
