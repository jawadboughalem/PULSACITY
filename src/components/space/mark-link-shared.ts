import { markMilestone } from "@/app/app/(espace)/space-milestone-actions";

export const markLinkShared = () => {
  void markMilestone("collection-link-shared").catch(() => undefined);
};
