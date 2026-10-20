import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { readMonogramLetters } from "@/components/ui/Monogram";

export const SOCIAL_IMAGE_SIZE = { width: 1200, height: 630 };

export const SOCIAL_IMAGE_TYPE = "image/png";

export const PROMISE = "Vos ventes deviennent des témoignages, automatiquement.";

const INK = "#16213E";
const GRAY = "#565B6B";
const SUN = "#FFBE3B";
const WHITE = "#FFFFFF";

/** Width over height of pulsacity-logo.svg (logo v2 « Galet »). */
const LOGO_RATIO = 263.38 / 64;
const LOGO_HEIGHT = 48;

/** Charte v2, ajouts 3.5: the title in 72, in 60 beyond 48 characters, so that it keeps to three lines. */
const LONG_TITLE_LENGTH = 48;

/**
 * The symbol on its own, in Encre (docs-internes/design-v2/identite/logo/svg/pulsacity-symbole-mono.svg, its
 * currentColor in Encre): on Soleil, the star is Encre too.
 */
const SYMBOL_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><defs><mask id="pz-g" maskUnits="userSpaceOnUse" x="0" y="0" width="64" height="64"><rect width="64" height="64" fill="white"/><circle cx="32" cy="23" r="6.5" fill="black"/><path d="M32.00 41.00 L35.12 47.21 L41.99 48.26 L37.04 53.14 L38.17 59.99 L32.00 56.80 L25.83 59.99 L26.96 53.14 L22.01 48.26 L28.88 47.21Z" fill="black" stroke="black" stroke-width="11" stroke-linejoin="round"/></mask></defs><g mask="url(#pz-g)" fill="${INK}"><path d="M32 4C40.5 8 45 17 45 28V40Q45 45 40 45H24Q19 45 19 40V28C19 17 23.5 8 32 4Z M19 25C12 28 8 34 8 42Q8 47.5 13.5 45.5L19 43Z M45 25C52 28 56 34 56 42Q56 47.5 50.5 45.5L45 43Z"/></g><path d="M32.00 41.00 L35.12 47.21 L41.99 48.26 L37.04 53.14 L38.17 59.99 L32.00 56.80 L25.83 59.99 L26.96 53.14 L22.01 48.26 L28.88 47.21Z" fill="${INK}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/></svg>`;

const SYMBOL_SOURCE = `data:image/svg+xml;base64,${Buffer.from(SYMBOL_SVG).toString("base64")}`;

/** What stands beside the symbol in the Soleil column: nothing, the tool of an integration's page, or « Guide ». */
export type SocialMark = { kind: "alone" } | { kind: "tool"; name: string } | { kind: "guide" };

/** The sizes of maquettes 3.5: the symbol alone in 220, with a tool in 120, with « Guide » in 148. */
const SYMBOL_SIZES: Record<SocialMark["kind"], number> = { alone: 220, tool: 120, guide: 148 };

const PulsacitySymbol = ({ size }: { size: number }) => (
  // eslint-disable-next-line @next/next/no-img-element -- ImageResponse draws plain img elements only
  <img src={SYMBOL_SOURCE} alt="" width={size} height={size} />
);

/** « avec » and the tool's initials on a white square: a monogram, never the tool's own logo (charte v2, Monogramme). */
const ToolMark = ({ name }: { name: string }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
    <div style={{ display: "flex", marginTop: 20, fontFamily: "Bricolage Grotesque", fontSize: 24, lineHeight: "32px" }}>
      avec
    </div>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 120,
        height: 120,
        marginTop: 20,
        borderRadius: 32,
        backgroundColor: WHITE,
        fontFamily: "Bricolage Grotesque",
        fontSize: Math.round(120 * 0.38),
      }}
    >
      {readMonogramLetters(name)}
    </div>
  </div>
);

const GuideMark = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      height: 52,
      marginTop: 24,
      paddingLeft: 26,
      paddingRight: 26,
      borderRadius: 999,
      backgroundColor: WHITE,
      fontFamily: "Figtree",
      fontWeight: 700,
      fontSize: 26,
    }}
  >
    Guide
  </div>
);

/**
 * Maquettes 3.5, Images de partage: on White, the logo, the page's title in Bricolage Grotesque 800 and the promise in
 * Figtree Gris; on the right, a Soleil column of 360 with the symbol in Encre, alone, « avec » the tool's initials, or
 * with « Guide ». No gradient, no label above the title, no rule. The fonts are static WOFF files (assets/og-fonts).
 */
export const renderSocialImage = async (title: string, mark: SocialMark = { kind: "alone" }): Promise<ImageResponse> => {
  // Literal paths: the build then traces these four files only, not the whole project.
  const [bricolage, figtree, figtreeBold, logo] = await Promise.all([
    readFile(join(process.cwd(), "assets", "og-fonts", "bricolage-grotesque-800.woff")),
    readFile(join(process.cwd(), "assets", "og-fonts", "figtree-400.woff")),
    readFile(join(process.cwd(), "assets", "og-fonts", "figtree-700.woff")),
    readFile(join(process.cwd(), "public", "brand", "pulsacity-logo.svg")),
  ]);
  const logoSource = `data:image/svg+xml;base64,${logo.toString("base64")}`;
  const titleSize = title.length > LONG_TITLE_LENGTH ? 60 : 72;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", backgroundColor: WHITE, color: INK }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: 840,
            paddingTop: 64,
            paddingBottom: 60,
            paddingLeft: 72,
            paddingRight: 72,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse draws plain img elements only */}
          <img src={logoSource} alt="" width={Math.round(LOGO_HEIGHT * LOGO_RATIO)} height={LOGO_HEIGHT} />
          <div
            style={{
              display: "flex",
              fontFamily: "Bricolage Grotesque",
              fontSize: titleSize,
              lineHeight: 1.05,
              letterSpacing: -0.02 * titleSize,
            }}
          >
            {title}
          </div>
          <div style={{ display: "flex", fontFamily: "Figtree", fontSize: 28, lineHeight: "36px", color: GRAY }}>
            {PROMISE}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: 360,
            backgroundColor: SUN,
          }}
        >
          <PulsacitySymbol size={SYMBOL_SIZES[mark.kind]} />
          {mark.kind === "tool" ? <ToolMark name={mark.name} /> : null}
          {mark.kind === "guide" ? <GuideMark /> : null}
        </div>
      </div>
    ),
    {
      ...SOCIAL_IMAGE_SIZE,
      fonts: [
        { name: "Bricolage Grotesque", data: bricolage, weight: 800, style: "normal" },
        { name: "Figtree", data: figtree, weight: 400, style: "normal" },
        { name: "Figtree", data: figtreeBold, weight: 700, style: "normal" },
      ],
    },
  );
};
