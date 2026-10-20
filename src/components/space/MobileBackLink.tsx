import Link from "next/link";
import { FOCUS_RING } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { MORE_SECTION_HREF } from "./space-sections";

type MobileBackLinkProps = {
  /** « Plus » by default: the pages reached from it (Réglages, Mon compte…). */
  href?: string;
  label?: string;
};

/**
 * Maquettes 3.3 and 3.4, on a phone: under the space's header, « ‹ Plus » (or the list the page was opened from) leads
 * back to it.
 */
export const MobileBackLink = ({ href = MORE_SECTION_HREF, label = "Plus" }: MobileBackLinkProps) => (
  <Link
    href={href}
    className={cn(
      "pz-couleur -mt-3 -ml-1 flex min-h-[44px] items-center gap-2 self-start rounded-full px-1 text-body font-bold text-ink hover:text-ink-800 desktop:hidden",
      FOCUS_RING,
    )}
  >
    <Icon name="chevronLeft" size={20} />
    {label}
  </Link>
);
