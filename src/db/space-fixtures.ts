import { randomUUID } from "node:crypto";
import type { Database } from "./database";
import { spaces, user } from "./schema";

export const insertTestUser = async (database: Database, email: string): Promise<string> => {
  const id = randomUUID();
  await database.insert(user).values({ id, email, name: "", emailVerified: true });
  return id;
};

export const insertTestSpace = async (
  database: Database,
  userId: string,
  slug: string,
  plan: "free" | "essentiel" | "pro" = "free",
): Promise<string> => {
  const [space] = await database
    .insert(spaces)
    .values({
      userId,
      name: `Espace ${slug}`,
      slug,
      replyToEmail: `${slug}@exemple.fr`,
      plan,
      referralCode: randomUUID().slice(0, 8),
    })
    .returning({ id: spaces.id });
  return space.id;
};
