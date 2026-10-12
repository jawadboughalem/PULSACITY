import { and, eq, isNotNull } from "drizzle-orm";
import type { Database } from "@/db/database";
import { connections, spaces, testimonials, widgets } from "@/db/schema";

export type ConnectionState = "none" | "pending" | "active" | "error";

export type SetupSteps = {
  isLinkShared: boolean;
  /** The best state among the space's connections, whatever their tool: one active connection is enough. */
  connection: ConnectionState;
  isWidgetPasted: boolean;
};

const STATE_PRIORITY = ["active", "pending", "error"] as const;

export const readSetupSteps = async (database: Database, spaceId: string): Promise<SetupSteps> => {
  const [[space], [formTestimonial], spaceConnections, [loadedWidget]] = await Promise.all([
    database
      .select({ collectionLinkSharedAt: spaces.collectionLinkSharedAt })
      .from(spaces)
      .where(eq(spaces.id, spaceId))
      .limit(1),
    database
      .select({ id: testimonials.id })
      .from(testimonials)
      .where(and(eq(testimonials.spaceId, spaceId), eq(testimonials.source, "form")))
      .limit(1),
    database
      .select({ status: connections.status })
      .from(connections)
      .where(eq(connections.spaceId, spaceId)),
    database
      .select({ id: widgets.id })
      .from(widgets)
      .where(and(eq(widgets.spaceId, spaceId), isNotNull(widgets.firstLoadedAt)))
      .limit(1),
  ]);
  const states = new Set(spaceConnections.map((connection) => connection.status));
  return {
    isLinkShared: Boolean(space?.collectionLinkSharedAt) || formTestimonial !== undefined,
    connection: STATE_PRIORITY.find((state) => states.has(state)) ?? "none",
    isWidgetPasted: loadedWidget !== undefined,
  };
};
