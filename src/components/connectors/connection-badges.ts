import type { BadgeTone } from "@/components/ui/ToneBadge";
import type { IconName } from "@/components/ui/icon-paths";

type Badge = { tone: BadgeTone; label: string; icon?: IconName };

type ConnectionStatus = "pending" | "active" | "error";

export const CONNECTION_BADGES = {
  active: { tone: "success", label: "Connecté", icon: "valid" },
  pending: { tone: "attention", label: "En attente", icon: "clock" },
  error: { tone: "error", label: "Problème", icon: "alert" },
} as const satisfies Record<ConnectionStatus, Badge>;

export const COMING_SOON_BADGE: Badge = { tone: "neutral", label: "Bientôt" };

export const ASSOCIATION_BADGES = {
  associated: { tone: "success", label: "Associée", icon: "valid" },
  awaiting: { tone: "attention", label: "À associer", icon: "clock" },
} as const satisfies Record<string, Badge>;
