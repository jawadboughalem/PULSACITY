"use client";

import { markLinkShared } from "@/components/space/mark-link-shared";
import { useCopyLink } from "@/components/space/useCopyLink";
import { SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

export const CopyCollectionLinkButton = ({ url }: { url: string }) => {
  const { isCopied, handleShare } = useCopyLink(url, markLinkShared);
  return (
    <>
      <button type="button" onClick={handleShare} className={cn(SECONDARY_BUTTON_CLASSES, "w-full desktop:w-auto desktop:self-start")}>
        {isCopied ? <Icon name="valid" size={20} /> : null}
        {isCopied ? "Lien copié" : "Copier le lien"}
      </button>
      <p aria-live="polite" className="sr-only">
        {isCopied ? "Le lien est copié." : ""}
      </p>
    </>
  );
};
