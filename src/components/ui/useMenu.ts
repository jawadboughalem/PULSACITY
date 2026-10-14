"use client";

import { type KeyboardEvent, type RefObject, useCallback, useEffect, useId, useState } from "react";

const ITEMS_SELECTOR = "a[href], button:not([disabled])";

type MenuRefs = {
  /** Holds the trigger and the menu: a click outside it closes the menu. */
  containerRef: RefObject<HTMLDivElement | null>;
  triggerRef: RefObject<HTMLButtonElement | null>;
  menuRef: RefObject<HTMLDivElement | null>;
};

const menuItems = (menu: HTMLElement | null) => [...(menu?.querySelectorAll<HTMLElement>(ITEMS_SELECTOR) ?? [])];

/**
 * Charte v2, Menu: the trigger says aria-expanded and aria-controls; up and down arrows move between the options,
 * Échap closes and gives the focus back to the trigger, a click elsewhere closes.
 */
export const useMenu = ({ containerRef, triggerRef, menuRef }: MenuRefs) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();

  const close = useCallback(
    (shouldFocusTrigger: boolean) => {
      setIsOpen(false);
      if (shouldFocusTrigger) triggerRef.current?.focus();
    },
    [triggerRef],
  );

  useEffect(() => {
    if (!isOpen) return;
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) close(false);
    };
    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") close(true);
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen, close, containerRef]);

  /** On the menu: the arrows move from option to option, around the ends. */
  const moveWithArrows = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    const items = menuItems(menuRef.current);
    if (items.length === 0) return;
    event.preventDefault();
    const current = items.indexOf(document.activeElement as HTMLElement);
    const step = event.key === "ArrowDown" ? 1 : -1;
    const next = current === -1 ? (step === 1 ? 0 : items.length - 1) : (current + step + items.length) % items.length;
    items[next].focus();
  };

  /** On the trigger: the down arrow opens the menu on its first option. */
  const openWithArrow = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "ArrowDown" || isOpen) return;
    event.preventDefault();
    setIsOpen(true);
    requestAnimationFrame(() => menuItems(menuRef.current)[0]?.focus());
  };

  return {
    isOpen,
    menuId,
    toggle: () => setIsOpen((wasOpen) => !wasOpen),
    close,
    moveWithArrows,
    openWithArrow,
  };
};
