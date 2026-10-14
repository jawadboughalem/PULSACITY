export type DeviceKind = "phone" | "computer";

export type Device = {
  /** « Chrome sur Mac », « Safari sur iPhone » */
  label: string;
  kind: DeviceKind;
};

/** Order matters: Edge and Opera name Chrome too, Chrome names Safari. */
const BROWSERS: [RegExp, string][] = [
  [/EdgA?\//, "Edge"],
  [/OPR\/|Opera/, "Opera"],
  [/SamsungBrowser\//, "Samsung Internet"],
  [/Firefox\/|FxiOS\//, "Firefox"],
  [/Chrome\/|CriOS\//, "Chrome"],
  [/Safari\//, "Safari"],
];

const SYSTEMS: [RegExp, string, DeviceKind][] = [
  [/iPhone/, "iPhone", "phone"],
  [/iPad/, "iPad", "phone"],
  [/Android/, "Android", "phone"],
  [/CrOS/, "Chromebook", "computer"],
  [/Mac OS X|Macintosh/, "Mac", "computer"],
  [/Windows/, "Windows", "computer"],
  [/Linux/, "Linux", "computer"],
];

/** Mon compte, « Appareils connectés »: a browser and a system read in the user agent, without any dependency. */
export const describeDevice = (userAgent: string | null): Device => {
  const agent = userAgent ?? "";
  const browser = BROWSERS.find(([pattern]) => pattern.test(agent))?.[1] ?? null;
  const system = SYSTEMS.find(([pattern]) => pattern.test(agent));
  const kind = system?.[2] ?? (/Mobile/.test(agent) ? "phone" : "computer");

  if (browser && system) return { label: `${browser} sur ${system[1]}`, kind };
  if (browser) return { label: browser, kind };
  if (system) return { label: system[1], kind };
  return { label: "Appareil inconnu", kind };
};
