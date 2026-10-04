import { z } from "zod";
import type { Database } from "@/db/database";
import { toolSuggestions } from "@/db/schema";
import type { RateLimitRule } from "@/lib/rate-limit/consume-rate-limit";

/** The same bounds as « Dites-nous quel outil » in the space. */
export const toolNameSchema = z.string().trim().min(2).max(80);

/** A visitor of /integrations, without a space: a few tools an hour is plenty. */
export const PUBLIC_TOOL_SUGGESTION_PER_IP: RateLimitRule = {
  name: "public-tool-suggestion-ip",
  limit: 5,
  windowSeconds: 60 * 60,
};

/** Every suggestion is kept, even twice the same tool: how often a tool is named is what counts. */
export const saveToolSuggestion = async (database: Database, toolName: string): Promise<void> => {
  await database.insert(toolSuggestions).values({ toolName });
};
