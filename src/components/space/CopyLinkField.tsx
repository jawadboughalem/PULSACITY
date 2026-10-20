"use client";

import { ActionDoneMessage } from "@/components/ui/ActionDoneMessage";
import { PRIMARY_BUTTON_CLASSES, SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { FIELD_LABEL_CLASSES, READ_ONLY_FIELD_CLASSES } from "@/components/ui/field-styles";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { markLinkShared } from "./mark-link-shared";
import { useCopyLink } from "./useCopyLink";

type CopyLinkFieldProps = {
  url: string;
  /** « secondary » where the screen has its main button elsewhere (Témoignages, empty: maquettes 3.4). */
  buttonVariant?: "primary" | "secondary";
};

export const CopyLinkField = ({ url, buttonVariant = "primary" }: CopyLinkFieldProps) => {
  const { isCopied, handleCopy } = useCopyLink(url, markLinkShared);

  return (
    <div className="flex max-w-text flex-col gap-2">
      <label htmlFor="collection-link" className={FIELD_LABEL_CLASSES}>
        Votre lien de collecte
      </label>
      <div className="flex gap-3">
        <input
          id="collection-link"
          type="text"
          readOnly
          value={url}
          onFocus={(event) => event.target.select()}
          className={cn(READ_ONLY_FIELD_CLASSES, "flex-1")}
        />
        <button
          type="button"
          onClick={handleCopy}
          className={buttonVariant === "primary" ? PRIMARY_BUTTON_CLASSES : cn(SECONDARY_BUTTON_CLASSES, "self-center")}
        >
          <Icon name={isCopied ? "check" : "copy"} size={20} />
          {isCopied ? "Lien copié" : "Copier le lien"}
        </button>
      </div>
      <ActionDoneMessage message={isCopied ? "Le lien est copié." : null} />
    </div>
  );
};
