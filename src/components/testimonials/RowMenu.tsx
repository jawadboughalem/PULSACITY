"use client";

import Link from "next/link";
import { useRef } from "react";
import { ICON_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/Icon";
import { MENU_ITEM_CLASSES, MENU_ITEM_DANGER_CLASSES, MENU_PANEL_CLASSES } from "@/components/ui/menu-styles";
import { useMenu } from "@/components/ui/useMenu";
import { cn } from "@/lib/cn";
import { prefixPersonWithDe } from "@/lib/french/prefix-with-de";

/** The menu sits 4 px from its trigger. */
const GAP_PX = 4;

type RowMenuProps = {
  authorName: string;
  detailHref: string;
  onDelete: () => void;
};

/**
 * Charte v2, Menu: « Ouvrir », then the destructive action last, which asks for a confirmation. The menu floats over the
 * page (position: fixed), so the table that scrolls sideways never cuts it; it opens upward when the window lacks room
 * below.
 */
export const RowMenu = ({ authorName, detailHref, onDelete }: RowMenuProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { isOpen, menuId, toggle, close, moveWithArrows, openWithArrow } = useMenu({
    containerRef,
    triggerRef,
    menuRef,
    shouldCloseOnScroll: true,
  });

  const placeMenu = (menu: HTMLDivElement | null) => {
    menuRef.current = menu;
    const trigger = triggerRef.current;
    if (!menu || !trigger) return;
    const box = trigger.getBoundingClientRect();
    const opensUpward = box.bottom + GAP_PX + menu.offsetHeight > window.innerHeight && box.top > menu.offsetHeight;
    menu.style.right = `${document.documentElement.clientWidth - box.right}px`;
    menu.style.top = `${opensUpward ? box.top - GAP_PX - menu.offsetHeight : box.bottom + GAP_PX}px`;
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-label={`Autres actions pour l'avis ${prefixPersonWithDe(authorName)}`}
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
          ref={placeMenu}
          id={menuId}
          data-ouvert="true"
          onKeyDown={moveWithArrows}
          className={cn(MENU_PANEL_CLASSES, "fixed z-30")}
        >
          <Link href={detailHref} className={MENU_ITEM_CLASSES}>
            Ouvrir
          </Link>
          <button
            type="button"
            onClick={() => {
              // The trigger takes the focus back first: the confirmation returns it there when it closes.
              close(true);
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
