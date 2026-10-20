"use client";

import { markLinkShared } from "@/components/space/mark-link-shared";
import { useCopyLink } from "@/components/space/useCopyLink";
import { ActionDoneMessage } from "@/components/ui/ActionDoneMessage";
import { SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

type CopyCollectionLinkButtonProps = {
  url: string;
  /** « Copier mon lien » (Demandes, empty) in place of « Copier le lien ». */
  label?: string;
  className?: string;
};

export const CopyCollectionLinkButton = ({ url, label, className = "w-full desktop:w-auto desktop:self-start" }: CopyCollectionLinkButtonProps) => {
  const { isCopied, handleShare } = useCopyLink(url, markLinkShared);
  return (
    <>
      <button type="button" onClick={handleShare} className={cn(SECONDARY_BUTTON_CLASSES, className)}>
        <Icon name={isCopied ? "check" : "copy"} size={20} />
        {isCopied ? "Lien copié" : (label ?? "Copier le lien")}
      </button>
      <ActionDoneMessage message={isCopied ? "Le lien est copié." : null} />
    </>
  );
};
