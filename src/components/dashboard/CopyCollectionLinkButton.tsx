"use client";

import { markLinkShared } from "@/components/space/mark-link-shared";
import { useCopyLink } from "@/components/space/useCopyLink";
import { SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

type CopyCollectionLinkButtonProps = {
  url: string;
  /** « Copier mon lien » shows the copy icon before it is used, as in m19. */
  label?: string;
};

export const CopyCollectionLinkButton = ({ url, label }: CopyCollectionLinkButtonProps) => {
  const { isCopied, handleShare } = useCopyLink(url, markLinkShared);
  return (
    <>
      <button type="button" onClick={handleShare} className={cn(SECONDARY_BUTTON_CLASSES, "w-full desktop:w-auto desktop:self-start")}>
        {isCopied ? <Icon name="valid" size={20} /> : label ? <Icon name="copy" size={20} /> : null}
        {isCopied ? "Lien copié" : (label ?? "Copier le lien")}
      </button>
      <p aria-live="polite" className="sr-only">
        {isCopied ? "Le lien est copié." : ""}
      </p>
    </>
  );
};
