import { and, eq, isNotNull } from "drizzle-orm";
import type { Database } from "@/db/database";
import { connections, spaces, testimonials, widgets } from "@/db/schema";

export type SystemeConnectionState = "none" | "pending" | "active" | "error";

export type SetupSteps = {
  isLinkShared: boolean;
  systeme: SystemeConnectionState;
  isWidgetPasted: boolean;
};

const STATE_PRIORITY = ["active", "pending", "error"] as const;

export const readSetupSteps = async (database: Database, spaceId: string): Promise<SetupSteps> => {
  const [[space], [formTestimonial], systemeConnections, [loadedWidget]] = await Promise.all([
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
      .where(and(eq(connections.spaceId, spaceId), eq(connections.connector, "systeme"))),
    database
      .select({ id: widgets.id })
      .from(widgets)
      .where(and(eq(widgets.spaceId, spaceId), isNotNull(widgets.firstLoadedAt)))
      .limit(1),
  ]);
  const states = new Set(systemeConnections.map((connection) => connection.status));
  return {
    isLinkShared: Boolean(space?.collectionLinkSharedAt) || formTestimonial !== undefined,
    systeme: STATE_PRIORITY.find((state) => states.has(state)) ?? "none",
    isWidgetPasted: loadedWidget !== undefined,
  };
};
