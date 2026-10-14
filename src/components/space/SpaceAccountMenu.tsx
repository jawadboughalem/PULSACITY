"use client";

import Link from "next/link";
import { useRef } from "react";
import { signOut } from "@/app/app/sign-out-action";
import { FOCUS_RING } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/Icon";
import { ACCOUNT_MENU_ITEM_CLASSES, MENU_PANEL_CLASSES } from "@/components/ui/menu-styles";
import { SpaceAvatar } from "@/components/ui/SpaceAvatar";
import { useMenu } from "@/components/ui/useMenu";
import { cn } from "@/lib/cn";
import type { SpaceAccount } from "./SpaceAccount";
import { ACCOUNT_SECTIONS } from "./space-sections";

type SpaceAccountMenuProps = {
  account: SpaceAccount;
};

/**
 * Charte v2, Navigation de l'espace: the account button at the bottom (64 high, a pill on Nuage, Ciel once open), and
 * its menu above it, 296 wide: name, address, plan, then Mon compte, Abonnement et factures, Aide et contact, Se
 * déconnecter. The menu lives in the layout, which stays from page to page: following one of its links closes it.
 */
export const SpaceAccountMenu = ({ account }: SpaceAccountMenuProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { isOpen, menuId, toggle, close, moveWithArrows, openWithArrow } = useMenu({ containerRef, triggerRef, menuRef });

  return (
    <div ref={containerRef} className="relative mt-auto">
      {isOpen ? (
        <div
          ref={menuRef}
          id={menuId}
          data-ouvert="true"
          onKeyDown={moveWithArrows}
          className={cn(MENU_PANEL_CLASSES, "absolute bottom-full left-[0] mb-2 w-[296px]")}
        >
          <div className="flex flex-col px-[14px] pt-3 pb-2">
            <strong className="truncate text-small font-bold">{account.name}</strong>
            <span className="truncate text-small text-gray">{account.email}</span>
            <span className="text-legal text-gray">{`Plan ${account.planName}`}</span>
          </div>
          {ACCOUNT_SECTIONS.map((section) => (
            <Link
              key={section.label}
              href={section.href}
              onClick={() => close(false)}
              className={ACCOUNT_MENU_ITEM_CLASSES}
            >
              <Icon name={section.icon} size={20} />
              {section.label}
            </Link>
          ))}
          <form action={signOut} className="flex">
            <button type="submit" className={ACCOUNT_MENU_ITEM_CLASSES}>
              <Icon name="logout" size={20} />
              Se déconnecter
            </button>
          </form>
        </div>
      ) : null}
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls={isOpen ? menuId : undefined}
        onClick={toggle}
        onKeyDown={openWithArrow}
        className={cn(
          "pz-couleur flex h-[64px] w-full cursor-pointer items-center gap-3 rounded-full pr-4 pl-2 text-left hover:bg-sky",
          isOpen ? "bg-sky" : "bg-cloud",
          FOCUS_RING,
        )}
      >
        <SpaceAvatar name={account.name} logoUrl={account.logoUrl} size={44} background={isOpen ? "white" : "sky"} />
        <strong className="min-w-[0] flex-1 truncate text-small font-bold">{account.name}</strong>
        <Icon name="chevronDown" size={20} className={cn(isOpen && "rotate-180")} />
        <span className="sr-only">Votre compte</span>
      </button>
    </div>
  );
};
