import { afterEach, describe, expect, it, vi } from "vitest";
import { getDb } from "./index";
import { MissingDatabaseUrlError } from "./missing-database-url-error";

afterEach(() => {
  Reflect.deleteProperty(globalThis, "pulsacityDb");
  vi.unstubAllEnvs();
});

describe("getDb", () => {
  it("refuses to start without DATABASE_URL", () => {
    vi.stubEnv("DATABASE_URL", "");

    expect(() => getDb()).toThrow(MissingDatabaseUrlError);
  });

  it("sends no prepared statement, which the transaction pooler rejects", () => {
    vi.stubEnv("DATABASE_URL", "postgres://user:password@127.0.0.1:6543/postgres");

    expect(getDb().$client.options.prepare).toBe(false);
  });

  it("keeps one client per server instance", () => {
    vi.stubEnv("DATABASE_URL", "postgres://user:password@127.0.0.1:6543/postgres");

    expect(getDb()).toBe(getDb());
  });
});
