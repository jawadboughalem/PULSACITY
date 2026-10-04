import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const SOCIAL_IMAGE_SIZE = { width: 1200, height: 630 };

export const SOCIAL_IMAGE_TYPE = "image/png";

const PROMISE = "Vos ventes deviennent des témoignages, automatiquement.";

const INK = "#16213E";
const SLATE = "#5A5F6E";
const HAIRLINE = "#D8D9DD";

/**
 * The image shown when a page is shared: the logo, the page's title in Newsreader, the promise in Public Sans. White,
 * like the site; no gradient, no label above the title. The fonts are static WOFF files (assets/og-fonts).
 */
export const renderSocialImage = async (title: string): Promise<ImageResponse> => {
  // Literal paths: the build then traces these three files only, not the whole project.
  const [newsreader, publicSans, logo] = await Promise.all([
    readFile(join(process.cwd(), "assets", "og-fonts", "newsreader-500.woff")),
    readFile(join(process.cwd(), "assets", "og-fonts", "public-sans-400.woff")),
    readFile(join(process.cwd(), "public", "brand", "pulsacity-logo.svg")),
  ]);
  const logoSource = `data:image/svg+xml;base64,${logo.toString("base64")}`;
  const isLong = title.length > 60;

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
        <img src={logoSource} alt="" width={201} height={48} />
        <div style={{ display: "flex", fontFamily: "Newsreader", fontSize: isLong ? 60 : 72, lineHeight: 1.1 }}>
          {title}
        </div>
        <div
          style={{
            display: "flex",
            borderTop: `1px solid ${HAIRLINE}`,
            paddingTop: 32,
            fontFamily: "Public Sans",
            fontSize: 28,
            color: SLATE,
          }}
        >
          {PROMISE}
        </div>
      </div>
    ),
    {
      ...SOCIAL_IMAGE_SIZE,
      fonts: [
        { name: "Newsreader", data: newsreader, weight: 500, style: "normal" },
        { name: "Public Sans", data: publicSans, weight: 400, style: "normal" },
      ],
    },
  );
};
