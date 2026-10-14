"use client";

import { PRIMARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { FIELD_LABEL_CLASSES, READ_ONLY_FIELD_CLASSES } from "@/components/ui/field-styles";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { markLinkShared } from "./mark-link-shared";
import { useCopyLink } from "./useCopyLink";

type CopyLinkFieldProps = {
  url: string;
};

export const CopyLinkField = ({ url }: CopyLinkFieldProps) => {
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
        <button type="button" onClick={handleCopy} className={PRIMARY_BUTTON_CLASSES}>
          <Icon name={isCopied ? "valid" : "copy"} size={20} />
          {isCopied ? "Lien copié" : "Copier le lien"}
        </button>
      </div>
      <p aria-live="polite" className="sr-only">
        {isCopied ? "Le lien est copié." : ""}
      </p>
    </div>
  );
};
