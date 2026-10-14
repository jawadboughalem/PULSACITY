import Link from "next/link";
import { FOCUS_RING } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { MORE_SECTION_HREF } from "./space-sections";

/** v2 (Réglages, Mon compte), on a phone: under the space's header, « ‹ Plus » leads back to the page it came from. */
export const MobileBackLink = () => (
  <Link
    href={MORE_SECTION_HREF}
    className={cn(
      "pz-couleur -ml-1 flex min-h-[44px] items-center gap-2 self-start rounded-full px-1 text-body font-bold text-ink hover:text-ink-800 desktop:hidden",
      FOCUS_RING,
    )}
  >
    <Icon name="chevronLeft" size={20} />
    Plus
  </Link>
);
