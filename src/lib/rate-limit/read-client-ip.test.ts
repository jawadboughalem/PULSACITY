import { describe, expect, it } from "vitest";
import { readClientIp } from "./read-client-ip";

describe("readClientIp", () => {
  it("takes the client, first of the forwarded chain", () => {
    expect(readClientIp(new Headers({ "x-forwarded-for": "203.0.113.7, 10.0.0.1" }))).toBe("203.0.113.7");
  });

  it("falls back on x-real-ip, then on a shared bucket", () => {
    expect(readClientIp(new Headers({ "x-real-ip": "198.51.100.2" }))).toBe("198.51.100.2");
    expect(readClientIp(new Headers())).toBe("unknown");
  });
});
