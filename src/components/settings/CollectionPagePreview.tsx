import type { CSSProperties } from "react";
import { StarIcon } from "@/components/collect/StarIcon";
import { SpaceAvatar } from "@/components/ui/SpaceAvatar";
import { cn } from "@/lib/cn";
import { readAccentButtonColors } from "@/lib/colors/accent-button-colors";
import { readTypedColor } from "@/lib/colors/read-typed-color";
import { NO_BREAK_SPACE, quoteInFrench } from "@/lib/french/typography";

type CollectionPagePreviewProps = {
  spaceName: string;
  logoUrl: string | null;
  accentColor: string;
  productName: string;
  className?: string;
};

/**
 * Réglages, « Aperçu de votre page de collecte »: the top of the page as a customer sees it, with what the creator is
 * typing (name, logo, accent). A picture: nothing in it can be used.
 */
export const CollectionPagePreview = ({ spaceName, logoUrl, accentColor, productName, className }: CollectionPagePreviewProps) => {
  const button = readAccentButtonColors(readTypedColor(accentColor));
  const buttonStyle: CSSProperties | undefined = button ? { backgroundColor: button.background, color: button.text } : undefined;

  return (
    <aside
      aria-labelledby="collection-preview-title"
      className={cn("flex min-w-[0] flex-col gap-3 rounded-panel bg-white p-5", className)}
    >
      <h2 id="collection-preview-title" className="text-small font-bold text-gray">
        Aperçu de votre page de collecte
      </h2>
      <div aria-hidden="true" className="overflow-hidden rounded-card border-2 border-sky">
        <div className="flex flex-col gap-3 bg-sky p-4">
          <div className="flex items-center gap-3">
            <SpaceAvatar name={spaceName || "?"} logoUrl={logoUrl} size={36} background="white" />
            <p className="min-w-[0] truncate text-small font-bold">{spaceName}</p>
          </div>
          <p className="font-display text-h3 break-words">{`Votre avis sur ${quoteInFrench(productName)}${NO_BREAK_SPACE}?`}</p>
        </div>
        <div className="flex flex-col gap-4 bg-white p-4">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon key={star} size={20} />
            ))}
          </div>
          <span
            style={buttonStyle}
            className={cn(
              "flex h-[48px] items-center justify-center rounded-full text-small font-bold",
              !button && "bg-sun text-ink",
            )}
          >
            Envoyer mon avis
          </span>
        </div>
      </div>
      <p className="text-legal text-gray">Exemple d&apos;offre. Le bouton prend votre couleur d&apos;accent.</p>
    </aside>
  );
};
