import { existsSync } from "node:fs";
import { defineConfig } from "drizzle-kit";

// drizzle-kit does not read env files: load the local one when there is one.
if (existsSync(".env.local")) process.loadEnvFile(".env.local");

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  // Only `migrate` connects. The pooler URL works: drizzle-kit sends
  // unprepared statements and applies pending migrations in one transaction.
  dbCredentials: { url: process.env.DATABASE_URL ?? "" },
  strict: true,
  verbose: true,
});
