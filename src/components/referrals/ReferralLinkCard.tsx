"use client";

import { SettingsSection } from "@/components/settings/SettingsSection";
import { useCopyLink } from "@/components/space/useCopyLink";
import { PRIMARY_BUTTON_CLASSES, SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { FIELD_CLASSES, FIELD_HINT_CLASSES, FIELD_LABEL_CLASSES } from "@/components/ui/field-styles";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

type ReferralLinkCardProps = {
  url: string;
  /** pulsacity.com/p/julie-nutrition: the link as the creator reads it. */
  shownUrl: string;
};

const FIELD_ID = "referral-link";

/**
 * Maquettes 3.3, Parrainage, « Votre lien »: the link and « Copier le lien »; on a phone, « Partager mon lien » first
 * (the phone's own sharing), then « Copier le lien ». « Le lien est copié. » says it under the field.
 */
export const ReferralLinkCard = ({ url, shownUrl }: ReferralLinkCardProps) => {
  const { isCopied, handleCopy, handleShare } = useCopyLink(url);
  return (
    <SettingsSection id="referral-link-title" title="Votre lien">
      <div className="flex flex-col gap-2">
        <label htmlFor={FIELD_ID} className={FIELD_LABEL_CLASSES}>
          Votre lien de parrainage
        </label>
        <div className="flex flex-col gap-3 desktop:flex-row">
          <input
            id={FIELD_ID}
            type="text"
            readOnly
            value={shownUrl}
            onFocus={(event) => event.target.select()}
            className={cn(FIELD_CLASSES, "desktop:flex-1")}
          />
          <button type="button" onClick={handleShare} className={cn(PRIMARY_BUTTON_CLASSES, "w-full desktop:hidden")}>
            <Icon name="share" size={20} />
            Partager mon lien
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className={cn(SECONDARY_BUTTON_CLASSES, "w-full desktop:hidden")}
          >
            <Icon name={isCopied ? "valid" : "copy"} size={20} />
            {isCopied ? "Lien copié" : "Copier le lien"}
          </button>
          <button type="button" onClick={handleCopy} className={cn(PRIMARY_BUTTON_CLASSES, "max-desktop:hidden")}>
            <Icon name={isCopied ? "valid" : "copy"} size={20} />
            {isCopied ? "Lien copié" : "Copier le lien"}
          </button>
        </div>
        <p aria-live="polite" className="text-small font-bold text-success empty:hidden">
          {isCopied ? "Le lien est copié." : ""}
        </p>
        <p className={FIELD_HINT_CLASSES}>
          Le créateur qui ouvre ce lien crée son espace comme tout le monde : même plan Gratuit, mêmes prix.
        </p>
      </div>
    </SettingsSection>
  );
};

/** The empty list's « Copier le lien », secondary: the link's own card holds the main button. */
export const CopyReferralLinkButton = ({ url }: { url: string }) => {
  const { isCopied, handleCopy } = useCopyLink(url);
  return (
    <>
      <button type="button" onClick={handleCopy} className={cn(SECONDARY_BUTTON_CLASSES, "self-start max-desktop:w-full")}>
        <Icon name={isCopied ? "valid" : "copy"} size={20} />
        {isCopied ? "Lien copié" : "Copier le lien"}
      </button>
      <p aria-live="polite" className="sr-only">
        {isCopied ? "Le lien est copié." : ""}
      </p>
    </>
  );
};
