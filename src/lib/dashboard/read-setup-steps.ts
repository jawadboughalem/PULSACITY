import { and, eq, isNotNull } from "drizzle-orm";
import type { Database } from "@/db/database";
import { connections, widgets } from "@/db/schema";

export type SystemeConnectionState = "none" | "pending" | "active" | "error";

export type SetupSteps = {
  systeme: SystemeConnectionState;
  isWidgetPasted: boolean;
};

const STATE_PRIORITY = ["active", "pending", "error"] as const;

export const readSetupSteps = async (database: Database, spaceId: string): Promise<SetupSteps> => {
  const [systemeConnections, [loadedWidget]] = await Promise.all([
    database
      .select({ status: connections.status })
      .from(connections)
      .where(and(eq(connections.spaceId, spaceId), eq(connections.connector, "systeme"))),
    database
      .select({ id: widgets.id })
      .from(widgets)
      .where(and(eq(widgets.spaceId, spaceId), isNotNull(widgets.firstLoadedAt)))
      .limit(1),
  ]);
  const states = new Set(systemeConnections.map((connection) => connection.status));
  return {
    systeme: STATE_PRIORITY.find((state) => states.has(state)) ?? "none",
    isWidgetPasted: loadedWidget !== undefined,
  };
};
