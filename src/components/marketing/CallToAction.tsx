import type { ReactNode } from "react";
import { SignUpLink } from "@/components/acquisition/SignUpLink";
import { cn } from "@/lib/cn";
import { LARGE_BUTTON_CLASSES } from "./marketing-styles";

/** Under every main call of the site (charte v2, ajouts 3.5, Appel principal). */
export const FREE_MENTION = "Gratuit, sans carte bancaire.";

type CallToActionProps = {
  /** Where the button is, for the audience: « accueil », « appel-final »… */
  place: string;
  /** « Gratuit, sans carte bancaire. » by default; the home's top adds the price and the data's place. */
  mention?: string;
  /** A link beside the button on a computer (« Voir comment ça marche »). */
  link?: ReactNode;
  /** On a phone, the link sits under the button (top of the home), or under the mention (prices of the home). */
  linkOnPhone?: "before-mention" | "after-mention";
  /** The mention beside the button on a computer, as on /integrations. */
  isMentionBeside?: boolean;
  /** Centred, as on the home's final call. */
  isCentered?: boolean;
  className?: string;
};

/**
 * Charte v2, ajouts 3.5, Appel principal: « Créer mon espace gratuit » on Soleil, 56 high, always followed by « Gratuit,
 * sans carte bancaire. » 15/22 Gris. On a phone, the button takes the full width and the line is centred under it.
 */
export const CallToAction = ({
  place,
  mention = FREE_MENTION,
  link,
  linkOnPhone = "before-mention",
  isMentionBeside = false,
  isCentered = false,
  className,
}: CallToActionProps) => (
  <div
    className={cn(
      "grid grid-cols-[minmax(0,1fr)] justify-items-stretch gap-3 desktop:justify-start desktop:justify-items-start desktop:gap-x-6",
      link || isMentionBeside ? "desktop:grid-cols-[auto_auto]" : "desktop:grid-cols-[auto]",
      isCentered && "desktop:justify-center desktop:justify-items-center",
      className,
    )}
  >
    <SignUpLink place={place} className={cn(LARGE_BUTTON_CLASSES, "desktop:col-start-1 desktop:row-start-1")}>
      Créer mon espace gratuit
    </SignUpLink>
    {link ? (
      <div
        className={cn(
          "flex justify-center desktop:col-start-2 desktop:row-start-1 desktop:items-center desktop:justify-start",
          linkOnPhone === "after-mention" && "order-last desktop:order-none",
        )}
      >
        {link}
      </div>
    ) : null}
    <p
      className={cn(
        "text-small text-gray",
        link && linkOnPhone === "before-mention" ? "mt-2 desktop:mt-[0]" : "text-center desktop:text-left",
        isMentionBeside
          ? "desktop:col-start-2 desktop:row-start-1 desktop:self-center"
          : "desktop:col-span-full desktop:row-start-2",
        isCentered && "desktop:text-center",
      )}
    >
      {mention}
    </p>
  </div>
);
