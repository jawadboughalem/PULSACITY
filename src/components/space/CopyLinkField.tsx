"use client";

import { PRIMARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/Icon";
import { markLinkShared } from "./mark-link-shared";
import { useCopyLink } from "./useCopyLink";

type CopyLinkFieldProps = {
  url: string;
};

export const CopyLinkField = ({ url }: CopyLinkFieldProps) => {
  const { isCopied, handleCopy } = useCopyLink(url, markLinkShared);

  return (
    <div className="flex max-w-text flex-col gap-3">
      <label htmlFor="collection-link" className="text-small font-bold">
        Votre lien de collecte
      </label>
      <div className="flex gap-3">
        <input
          id="collection-link"
          type="text"
          readOnly
          value={url}
          onFocus={(event) => event.target.select()}
          className="h-[48px] min-w-[0] flex-1 rounded-card border border-gray bg-sky px-4 text-body text-ink focus:border-2 focus:border-ink focus:px-[15px] focus:outline-none"
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
