import { describe, expect, it } from "vitest";
import { describeDevice } from "./describe-device";

const AGENTS = {
  chromeMac:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
  safariIphone:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1",
  edgeWindows:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36 Edg/141.0.0.0",
  firefoxWindows: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:143.0) Gecko/20100101 Firefox/143.0",
  chromeAndroid:
    "Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36",
  chromeIphone:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/141.0.0.0 Mobile/15E148 Safari/604.1",
};

describe("describeDevice", () => {
  it("names the browser and the system, as 3.3 writes them", () => {
    expect(describeDevice(AGENTS.chromeMac)).toEqual({ label: "Chrome sur Mac", kind: "computer" });
    expect(describeDevice(AGENTS.safariIphone)).toEqual({ label: "Safari sur iPhone", kind: "phone" });
    expect(describeDevice(AGENTS.edgeWindows)).toEqual({ label: "Edge sur Windows", kind: "computer" });
    expect(describeDevice(AGENTS.firefoxWindows)).toEqual({ label: "Firefox sur Windows", kind: "computer" });
    expect(describeDevice(AGENTS.chromeAndroid)).toEqual({ label: "Chrome sur Android", kind: "phone" });
    expect(describeDevice(AGENTS.chromeIphone)).toEqual({ label: "Chrome sur iPhone", kind: "phone" });
  });

  it("says what it does not know", () => {
    expect(describeDevice(null)).toEqual({ label: "Appareil inconnu", kind: "computer" });
    expect(describeDevice("curl/8.5.0")).toEqual({ label: "Appareil inconnu", kind: "computer" });
  });
});
