import { Icon } from "./Icon";
import type { IconName } from "./icon-paths";

/**
 * Charte v2, État vide: a simple illustration of 120 at most (here 112, 88 on a phone, as the maquettes 3.4), the icon
 * of what is missing on a Ciel disc.
 */
export const EmptyIllustration = ({ icon }: { icon: IconName }) => (
  <span aria-hidden="true" className="flex size-[88px] shrink-0 items-center justify-center rounded-full bg-sky text-ink desktop:size-[112px]">
    <Icon name={icon} size={32} />
  </span>
);
