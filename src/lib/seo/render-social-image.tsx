import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const SOCIAL_IMAGE_SIZE = { width: 1200, height: 630 };

export const SOCIAL_IMAGE_TYPE = "image/png";

const PROMISE = "Vos ventes deviennent des témoignages, automatiquement.";

const INK = "#16213E";
const GRAY = "#565B6B";

/** Width over height of pulsacity-logo.svg (logo v2 « Galet »). */
const LOGO_RATIO = 263.38 / 64;
const LOGO_HEIGHT = 48;

/**
 * The image shown when a page is shared: the logo, the page's title in Bricolage Grotesque 800, the promise in Figtree.
 * White, like the site; no gradient, no label above the title, no rule (charte v2). The fonts are static WOFF files
 * (assets/og-fonts).
 */
export const renderSocialImage = async (title: string): Promise<ImageResponse> => {
  // Literal paths: the build then traces these three files only, not the whole project.
  const [bricolage, figtree, logo] = await Promise.all([
    readFile(join(process.cwd(), "assets", "og-fonts", "bricolage-grotesque-800.woff")),
    readFile(join(process.cwd(), "assets", "og-fonts", "figtree-400.woff")),
    readFile(join(process.cwd(), "public", "brand", "pulsacity-logo.svg")),
  ]);
  const logoSource = `data:image/svg+xml;base64,${logo.toString("base64")}`;
  const isLong = title.length > 60;
  const titleSize = isLong ? 60 : 72;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          backgroundColor: "#FFFFFF",
          color: INK,
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
            letterSpacing: -0.035 * titleSize,
          }}
        >
          {title}
        </div>
        <div style={{ display: "flex", fontFamily: "Figtree", fontSize: 28, color: GRAY }}>
          {PROMISE}
        </div>
      </div>
    ),
    {
      ...SOCIAL_IMAGE_SIZE,
      fonts: [
        { name: "Bricolage Grotesque", data: bricolage, weight: 800, style: "normal" },
        { name: "Figtree", data: figtree, weight: 400, style: "normal" },
      ],
    },
  );
};
