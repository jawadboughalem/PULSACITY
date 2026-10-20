"use client";

import { useEffect, useState } from "react";
import { SignUpLink } from "@/components/acquisition/SignUpLink";
import { PRIMARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { cn } from "@/lib/cn";

/** The element the bar watches: the top's « Créer mon espace gratuit ». */
export const HERO_CALL_ID = "appel-haut-de-page";

/** The final call: once it is on the screen, its own button replaces the bar. */
export const FINAL_CALL_ID = "appel-final";

const isTyping = () => {
  const element = document.activeElement;
  return element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement;
};

/**
 * Maquettes 3.5, Accueil, barre fixe du téléphone (charte v2, ajouts 3.5): « Gratuit, sans carte bancaire » above a
 * Soleil button of 48, on white, with the tab bar's shadow, 98 high. It shows once the top's button has left the
 * screen, and goes when the final call comes in, or while a field is being typed in (the keyboard is open). Not on a
 * computer. It appears and goes at once: nothing moves with the scroll (charte v2, Mouvement). While it shows, a
 * focused element is never hidden under it.
 */
export const StickyCallBar = () => {
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    const heroCall = document.getElementById(HERO_CALL_ID);
    const finalCall = document.getElementById(FINAL_CALL_ID);
    if (!heroCall || !finalCall) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const isHeroGone = heroCall.getBoundingClientRect().bottom < 0;
      const isFinalReached = finalCall.getBoundingClientRect().top < window.innerHeight;
      setIsShown(isHeroGone && !isFinalReached && !isTyping());
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("focusin", schedule);
    document.addEventListener("focusout", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("focusin", schedule);
      document.removeEventListener("focusout", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      hidden={!isShown}
      data-barre-fixe={isShown}
      className="fixed inset-x-[0] bottom-[0] z-20 flex h-[98px] flex-col gap-[6px] bg-white px-4 pt-[10px] pb-[14px] shadow-tab-bar desktop:hidden"
    >
      <p className="text-center text-badge font-semibold">Gratuit, sans carte bancaire</p>
      <SignUpLink place="barre-fixe" className={cn(PRIMARY_BUTTON_CLASSES, "h-[48px] w-full")}>
        Créer mon espace gratuit
      </SignUpLink>
    </div>
  );
};
