"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

const ITEM_CLASSES =
  "flex min-h-[44px] w-full items-center px-4 text-left text-small hover:bg-paper-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900";

type RowMenuProps = {
  authorName: string;
  detailHref: string;
  onDelete: () => void;
};

export const RowMenu = ({ authorName, detailHref, onDelete }: RowMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!isOpen) return;
    const close = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label={`Autres actions pour l'avis de ${authorName}`}
        aria-expanded={isOpen}
        aria-controls={isOpen ? menuId : undefined}
        onClick={() => setIsOpen((wasOpen) => !wasOpen)}
        className={cn(
          "flex size-[44px] items-center justify-center rounded-sm hover:bg-paper-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900",
          isOpen && "bg-paper-100",
        )}
      >
        <Icon name="more" size={20} />
      </button>
      {isOpen ? (
        <ul
          id={menuId}
          className="absolute top-full right-[0] z-10 mt-1 flex w-[232px] flex-col border border-hairline-200 bg-white py-2 shadow-float"
        >
          <li>
            <Link href={detailHref} className={ITEM_CLASSES}>
              Ouvrir
            </Link>
          </li>
          <li>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onDelete();
              }}
              className={cn(ITEM_CLASSES, "text-error")}
            >
              Supprimer définitivement
            </button>
          </li>
        </ul>
      ) : null}
    </div>
  );
};
