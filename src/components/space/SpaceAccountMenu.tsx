"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { signOut } from "@/app/app/sign-out-action";
import { Icon } from "@/components/ui/Icon";
import { SpaceAvatar } from "@/components/ui/SpaceAvatar";
import { cn } from "@/lib/cn";
import type { SpaceAccount } from "./SpaceAccount";
import { ACCOUNT_SECTIONS } from "./space-sections";

const FOCUS_RING = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900";

type SpaceAccountMenuProps = {
  account: SpaceAccount;
};

export const SpaceAccountMenu = ({ account }: SpaceAccountMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!isOpen) return;
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative mt-auto border-t border-hairline-200 pt-4">
      {isOpen ? (
        <div
          id={menuId}
          className="absolute inset-x-[0] bottom-full mb-1 flex flex-col border border-hairline-200 bg-white shadow-float"
        >
          <div className="flex flex-col border-b border-hairline-200 px-4 py-4">
            <strong className="truncate text-small font-semibold">{account.name}</strong>
            <span className="truncate text-small text-slate-600">{account.email}</span>
            <span className="text-legal text-slate-600">{`Plan ${account.planName}`}</span>
          </div>
          <ul className="flex flex-col border-b border-hairline-200 py-2">
            {ACCOUNT_SECTIONS.map((section) => (
              <li key={section.label}>
                <Link
                  href={section.href}
                  className={cn("flex min-h-[44px] items-center gap-3 px-4 py-2 text-small hover:bg-paper-100", FOCUS_RING)}
                >
                  <Icon name={section.icon} size={20} />
                  {section.label}
                </Link>
              </li>
            ))}
          </ul>
          <form action={signOut} className="py-2">
            <button
              type="submit"
              className={cn(
                "flex min-h-[44px] w-full items-center gap-3 px-4 text-small font-semibold hover:bg-paper-100",
                FOCUS_RING,
              )}
            >
              <Icon name="logout" size={20} />
              Se déconnecter
            </button>
          </form>
        </div>
      ) : null}
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={isOpen ? menuId : undefined}
        onClick={() => setIsOpen((wasOpen) => !wasOpen)}
        className={cn(
          "flex w-full items-center gap-3 rounded-sm px-3 py-2 text-left hover:bg-paper-100",
          isOpen && "bg-paper-100",
          FOCUS_RING,
        )}
      >
        <SpaceAvatar name={account.name} logoUrl={account.logoUrl} size={44} background="paper" />
        <span className="flex min-w-[0] flex-1 flex-col">
          <strong className="truncate text-small font-semibold">{account.name}</strong>
          <span className="truncate text-small text-slate-600">{account.detail}</span>
        </span>
        <Icon name="chevronDown" size={20} className={cn(isOpen && "rotate-180")} />
        <span className="sr-only">Votre compte</span>
      </button>
    </div>
  );
};
