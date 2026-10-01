"use client";

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
        <Icon name={isCopied ? "valid" : "share"} size={20} />
        {isCopied ? "Lien copié" : "Partager mon lien"}
      </button>
      <p aria-live="polite" className="sr-only">
        {isCopied ? "Le lien est copié." : ""}
      </p>
    </>
  );
};
