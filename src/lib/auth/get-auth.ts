import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { magicLink } from "better-auth/plugins/magic-link";
import { getDb } from "@/db";
import { account, session, user, verification } from "@/db/schema";
import { readRequiredEnvironmentVariable } from "@/lib/environment/read-required-environment-variable";
import { MAGIC_LINK_LIFETIME_SECONDS } from "./magic-link-lifetime";
import { sendMagicLink } from "./send-magic-link";

const createAuth = () => {
  const database = getDb();
  return betterAuth({
    appName: "PULSACITY",
    baseURL: readRequiredEnvironmentVariable("BETTER_AUTH_URL"),
    secret: readRequiredEnvironmentVariable("BETTER_AUTH_SECRET"),
    database: drizzleAdapter(database, {
      provider: "pg",
      schema: { user, session, account, verification },
    }),
    telemetry: { enabled: false },
    plugins: [
      magicLink({
        expiresIn: MAGIC_LINK_LIFETIME_SECONDS,
        storeToken: "hashed",
        sendMagicLink: ({ email, url }) => sendMagicLink(database, email, url),
      }),
      nextCookies(),
    ],
  });
};

type Auth = ReturnType<typeof createAuth>;

const globalForAuth = globalThis as typeof globalThis & { pulsacityAuth?: Auth };

export const getAuth = (): Auth => {
  globalForAuth.pulsacityAuth ??= createAuth();
  return globalForAuth.pulsacityAuth;
};
