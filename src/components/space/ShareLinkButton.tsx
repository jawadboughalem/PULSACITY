"use client";

import { ActionDoneMessage } from "@/components/ui/ActionDoneMessage";
import { PRIMARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { markLinkShared } from "./mark-link-shared";
import { useCopyLink } from "./useCopyLink";

type ShareLinkButtonProps = {
  url: string;
};

export const ShareLinkButton = ({ url }: ShareLinkButtonProps) => {
  const { isCopied, handleShare } = useCopyLink(url, markLinkShared);

  return (
    <>
      <button type="button" onClick={handleShare} className={cn(PRIMARY_BUTTON_CLASSES, "w-full")}>
        <Icon name={isCopied ? "check" : "share"} size={20} />
        {isCopied ? "Lien copié" : "Partager mon lien"}
      </button>
      <ActionDoneMessage message={isCopied ? "Le lien est copié." : null} />
    </>
  );
};
