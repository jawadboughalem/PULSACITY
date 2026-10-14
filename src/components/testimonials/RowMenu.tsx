"use client";

import Link from "next/link";
import { useRef } from "react";
import { ICON_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/Icon";
import { MENU_ITEM_CLASSES, MENU_ITEM_DANGER_CLASSES, MENU_PANEL_CLASSES } from "@/components/ui/menu-styles";
import { useMenu } from "@/components/ui/useMenu";
import { cn } from "@/lib/cn";

type RowMenuProps = {
  authorName: string;
  detailHref: string;
  onDelete: () => void;
};

/** Charte v2, Menu: « Ouvrir », then the destructive action last, which asks for a confirmation. */
export const RowMenu = ({ authorName, detailHref, onDelete }: RowMenuProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { isOpen, menuId, toggle, close, moveWithArrows, openWithArrow } = useMenu({
    containerRef,
    triggerRef,
    menuRef,
  });

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-label={`Autres actions pour l'avis de ${authorName}`}
        aria-expanded={isOpen}
        aria-controls={isOpen ? menuId : undefined}
        onClick={toggle}
        onKeyDown={openWithArrow}
        className={cn(ICON_BUTTON_CLASSES, isOpen && "bg-sky")}
      >
        <Icon name="more" size={20} />
      </button>
      {isOpen ? (
        <div
          ref={menuRef}
          id={menuId}
          data-ouvert="true"
          onKeyDown={moveWithArrows}
          className={cn(MENU_PANEL_CLASSES, "absolute top-full right-[0] mt-1")}
        >
          <Link href={detailHref} className={MENU_ITEM_CLASSES}>
            Ouvrir
          </Link>
          <button
            type="button"
            onClick={() => {
              close(false);
              onDelete();
            }}
            className={MENU_ITEM_DANGER_CLASSES}
          >
            Supprimer définitivement
          </button>
        </div>
      ) : null}
    </div>
  );
};
