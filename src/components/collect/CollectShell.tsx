import type { CSSProperties, ReactNode } from "react";
import { readAccentTint } from "@/lib/colors/accent-button-colors";
import { CollectHeader } from "./CollectHeader";
import { PoweredByPulsacity } from "./PoweredByPulsacity";

/** Charte v2, ajouts 3.6, Page de collecte: Nuage when the creator chose no accent, and on pages without a creator. */
const NO_ACCENT_TINT = "#F4F8FF";

/** Figtree 800, 32/38 (26/32 on a phone), −0.01 em: the collect page has no Bricolage, the creator's identity only. */
export const COLLECT_TITLE_CLASSES =
  "text-[26px] leading-[32px] font-extrabold tracking-[-0.01em] desktop:text-[32px] desktop:leading-[38px]";

export type CollectIdentity = {
  name: string;
  logoUrl: string | null;
  accentColor: string | null;
};

type CollectShellProps = {
  /** The creator whose page this is; null on a page that cannot say whose it is (a broken link). */
  identity: CollectIdentity | null;
  /** The logo and the name on top: every page of the creator but the thanks, where they sit in the card. */
  hasHeader?: boolean;
  /** « Propulsé par PULSACITY » under the card; null on PULSACITY's own pages and on pages without a creator. */
  poweredBy: { homeUrl: string; referralCode: string } | null;
  children: ReactNode;
};

/**
 * Maquettes 3.6, « Page de collecte »: the page tinted with the creator's accent (9 % on Blanc), their logo and name on
 * top, then a white card, radius 24, padding 48 56, in a column of 640. On a phone, a tinted band on top, the page
 * white. The same shell carries the answers to a correction and the unsubscription.
 */
export const CollectShell = ({ identity, hasHeader = identity !== null, poweredBy, children }: CollectShellProps) => {
  const tint = readAccentTint(identity?.accentColor ?? null) ?? NO_ACCENT_TINT;
  return (
    <div
      className="flex min-h-dvh flex-col bg-white text-ink desktop:bg-(--tint) desktop:pt-11 desktop:pb-10"
      style={{ "--tint": tint } as CSSProperties}
    >
      {identity && hasHeader ? (
        <div className="bg-(--tint) desktop:bg-transparent">
          <CollectHeader
            spaceName={identity.name}
            logoUrl={identity.logoUrl}
            accentColor={identity.accentColor}
            className="mx-auto max-w-[640px] px-page-gutter py-4 desktop:px-[0] desktop:pt-[0] desktop:pb-6"
          />
        </div>
      ) : null}
      <main className="mx-auto flex w-full max-w-[640px] flex-col px-page-gutter pt-6 pb-5 desktop:rounded-panel desktop:bg-white desktop:px-11 desktop:py-10">
        {children}
      </main>
      {poweredBy ? (
        <PoweredByPulsacity
          homeUrl={poweredBy.homeUrl}
          referralCode={poweredBy.referralCode}
          className="mt-auto pb-4 desktop:mt-2 desktop:pb-[0]"
        />
      ) : null}
    </div>
  );
};
