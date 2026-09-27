import { is } from "drizzle-orm";
import { PgTable, getTableConfig } from "drizzle-orm/pg-core";
import { describe, expect, it } from "vitest";
import * as schema from "./schema";

const tables = Object.values(schema).filter((value) => is(value, PgTable));

describe("schema", () => {
  it("keeps row level security on for every table", () => {
    const withoutRowLevelSecurity = tables
      .map((table) => getTableConfig(table))
      .filter((config) => !config.enableRLS)
      .map((config) => config.name);

    expect(tables).not.toHaveLength(0);
    expect(withoutRowLevelSecurity).toEqual([]);
  });
});
