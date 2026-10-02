/** The walls and carousels already shown on the page: the badge links to the first wall, or carousel. */

export type ReviewsTarget = {
  host: HTMLElement;
  type: "wall" | "carousel";
  focus: () => void;
};

export type ReviewsDirectory = {
  register: (target: ReviewsTarget) => void;
  find: () => ReviewsTarget | null;
  subscribe: (listener: () => void) => () => void;
};

const inPageOrder = (first: ReviewsTarget, second: ReviewsTarget) =>
  first.host.compareDocumentPosition(second.host) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;

export const createReviewsDirectory = (): ReviewsDirectory => {
  const targets: ReviewsTarget[] = [];
  const listeners = new Set<() => void>();
  return {
    register: (target) => {
      targets.push(target);
      for (const listener of listeners) listener();
    },
    find: () => {
      const shown = targets.filter((target) => target.host.isConnected).sort(inPageOrder);
      return shown.find((target) => target.type === "wall") ?? shown[0] ?? null;
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
};
