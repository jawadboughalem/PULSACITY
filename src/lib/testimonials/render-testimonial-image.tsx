import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { STAR_PATH } from "@/components/ui/icon-paths";
import { readAccentButtonColors } from "@/lib/colors/accent-button-colors";
import { formatDayMonthYear, formatMonthYear } from "@/lib/dates/format-french-date";
import { quoteInFrench } from "@/lib/french/typography";
import { getInitials } from "@/lib/spaces/get-initials";

/** Maquettes 3.6, « Image de partage d'un témoignage »: a post (1080 × 1350) and a link's preview (1200 × 630). */
export const TESTIMONIAL_IMAGE_FORMATS = {
  portrait: { width: 1080, height: 1350 },
  paysage: { width: 1200, height: 630 },
} as const;

export type TestimonialImageFormat = keyof typeof TESTIMONIAL_IMAGE_FORMATS;

export const isTestimonialImageFormat = (value: unknown): value is TestimonialImageFormat =>
  value === "portrait" || value === "paysage";

export type TestimonialImage = {
  format: TestimonialImageFormat;
  spaceName: string;
  logoUrl: string | null;
  accentColor: string | null;
  /** « Propulsé par PULSACITY », retired on the Pro plan as in the widget. */
  showsPoweredBy: boolean;
  /** « J'offre une contrepartie » (Réglages): said at the bottom, as under the widgets. */
  declaresIncentive: boolean;
  authorName: string;
  authorTitle: string | null;
  rating: number;
  text: string;
  reviewedAt: Date;
  purchasedAt: Date | null;
};

const INK = "#16213E";
const SUN = "#FFBE3B";
const WHITE = "#FFFFFF";

export const INCENTIVE_NOTE = "Certains clients ont reçu une contrepartie pour leur avis.";

/** « Avis du 12 sept. 2026, achat en août 2026 », as in the widget; the review's date alone without a purchase. */
export const describeReviewDates = (reviewedAt: Date, purchasedAt: Date | null): string =>
  `Avis du ${formatDayMonthYear(reviewedAt)}${purchasedAt === null ? "" : `, achat en ${formatMonthYear(purchasedAt)}`}`;

/** The landscape keeps 4 lines at most: the quote is cut at a word, with « … ». */
const LANDSCAPE_MAX_CHARACTERS = 190;

/** The post keeps the whole quote, smaller as it grows (66/84, then 56/72 past 100 characters, charte 3.6). */
const PORTRAIT_SIZES = [
  { upTo: 100, size: 66, lineHeight: 84 },
  { upTo: 220, size: 56, lineHeight: 72 },
  { upTo: 400, size: 44, lineHeight: 58 },
  { upTo: Number.POSITIVE_INFINITY, size: 36, lineHeight: 48 },
];

const PORTRAIT_MAX_CHARACTERS = 640;

export const cutAtWord = (text: string, max: number): string => {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:.!?]+$/, "")}…`;
};

/**
 * The space's accent behind, its text White if it reaches 4,5:1, otherwise Encre, the stars in the text's colour.
 * Without an accent, Encre with Soleil stars: the logo never stands on Soleil (charte v2, combinaisons interdites).
 */
const readColors = (accentColor: string | null) => {
  const accent = readAccentButtonColors(accentColor);
  return accent === null
    ? { background: INK, text: WHITE, stars: SUN }
    : { background: accent.background, text: accent.text, stars: accent.text };
};

/** The logo is read here, so that one that does not answer leaves its initials instead of failing the image. */
const readLogo = async (logoUrl: string | null): Promise<string | null> => {
  if (logoUrl === null) return null;
  try {
    const response = await fetch(logoUrl, { signal: AbortSignal.timeout(4000) });
    if (!response.ok) return null;
    const type = response.headers.get("content-type") ?? "image/png";
    if (!type.startsWith("image/")) return null;
    return `data:${type};base64,${Buffer.from(await response.arrayBuffer()).toString("base64")}`;
  } catch {
    return null;
  }
};

const Stars = ({ rating, size, color }: { rating: number; size: number; color: string }) => (
  <div style={{ display: "flex", gap: Math.round(size * 0.16) }}>
    {[1, 2, 3, 4, 5].map((star) => (
      <svg key={star} width={size} height={size} viewBox="0 0 24 24">
        <path d={STAR_PATH} fill={star <= rating ? color : "none"} stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
      </svg>
    ))}
  </div>
);

/**
 * Draws a validated testimonial in the space's colours: its logo and name, the stars, the quote, the author, the dates
 * of the review and of the purchase, the counterpart if there is one, « Propulsé par » discreet. Figtree: the creator's
 * page is not known here. No gradient, no rule, never « avis vérifiés ».
 */
export const renderTestimonialImage = async (image: TestimonialImage): Promise<ImageResponse> => {
  const isPortrait = image.format === "portrait";
  const { background, text, stars } = readColors(image.accentColor);
  const [figtree400, figtree600, figtree700, brand, logo] = await Promise.all([
    readFile(join(process.cwd(), "assets", "og-fonts", "figtree-400.woff")),
    readFile(join(process.cwd(), "assets", "og-fonts", "figtree-600.woff")),
    readFile(join(process.cwd(), "assets", "og-fonts", "figtree-700.woff")),
    text === WHITE
      ? readFile(join(process.cwd(), "public", "brand", "pulsacity-logo-sombre.svg"))
      : readFile(join(process.cwd(), "public", "brand", "pulsacity-logo.svg")),
    readLogo(image.logoUrl),
  ]);

  const quote = isPortrait
    ? cutAtWord(image.text, PORTRAIT_MAX_CHARACTERS)
    : cutAtWord(image.text, LANDSCAPE_MAX_CHARACTERS);
  const quoteSize = isPortrait
    ? (PORTRAIT_SIZES.find((size) => quote.length <= size.upTo) ?? PORTRAIT_SIZES[0])
    : { size: 40, lineHeight: 52 };
  const padding = isPortrait ? 96 : 72;
  const logoSize = isPortrait ? 88 : 64;
  const brandHeight = isPortrait ? 38 : 30;
  const footerSize = isPortrait ? 22 : 18;
  const dates = describeReviewDates(image.reviewedAt, image.purchasedAt);

  const header = (
    <div style={{ display: "flex", alignItems: "center", gap: isPortrait ? 24 : 20 }}>
      {logo === null ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: logoSize,
            height: logoSize,
            borderRadius: logoSize,
            backgroundColor: text,
            color: background,
            fontWeight: 700,
            fontSize: Math.round(logoSize * 0.36),
          }}
        >
          {getInitials(image.spaceName)}
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- ImageResponse draws plain img elements only
        <img src={logo} alt="" width={logoSize} height={logoSize} style={{ borderRadius: logoSize, objectFit: "cover" }} />
      )}
      <div style={{ display: "flex", fontSize: isPortrait ? 40 : 32, fontWeight: 700 }}>{image.spaceName}</div>
    </div>
  );

  const author = isPortrait ? (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", fontSize: 40, fontWeight: 700 }}>{image.authorName}</div>
      {image.authorTitle ? <div style={{ display: "flex", fontSize: 32, opacity: 0.85 }}>{image.authorTitle}</div> : null}
      <div style={{ display: "flex", fontSize: 26, opacity: 0.85 }}>{dates}</div>
    </div>
  ) : (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", fontSize: 28, fontWeight: 700 }}>
        {image.authorTitle ? `${image.authorName} · ${image.authorTitle}` : image.authorName}
      </div>
      <div style={{ display: "flex", fontSize: 22, opacity: 0.85 }}>{dates}</div>
    </div>
  );

  const poweredBy = image.showsPoweredBy ? (
    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: footerSize, opacity: 0.85 }}>
      Propulsé par
      {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse draws plain img elements only */}
      <img
        src={`data:image/svg+xml;base64,${brand.toString("base64")}`}
        alt=""
        height={brandHeight}
        width={Math.round((brandHeight * 263.38) / 64)}
      />
    </div>
  ) : null;

  const incentive = image.declaresIncentive ? (
    <div style={{ display: "flex", fontSize: footerSize, opacity: 0.85 }}>{INCENTIVE_NOTE}</div>
  ) : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding,
          backgroundColor: background,
          color: text,
          fontFamily: "Figtree",
        }}
      >
        {isPortrait ? (
          header
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {header}
            <Stars rating={image.rating} size={40} color={stars} />
          </div>
        )}
        <div style={{ display: "flex", flex: 1, flexDirection: "column", justifyContent: "center", gap: isPortrait ? 48 : 0 }}>
          {isPortrait ? <Stars rating={image.rating} size={64} color={stars} /> : null}
          <div
            style={{
              display: "flex",
              fontSize: quoteSize.size,
              lineHeight: `${quoteSize.lineHeight}px`,
              fontWeight: 600,
            }}
          >
            {quoteInFrench(quote)}
          </div>
          {isPortrait ? author : null}
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24 }}>
          {isPortrait ? (incentive ?? <div style={{ display: "flex" }} />) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {author}
              {incentive}
            </div>
          )}
          {poweredBy}
        </div>
      </div>
    ),
    {
      ...TESTIMONIAL_IMAGE_FORMATS[image.format],
      fonts: [
        { name: "Figtree", data: figtree400, weight: 400, style: "normal" },
        { name: "Figtree", data: figtree600, weight: 600, style: "normal" },
        { name: "Figtree", data: figtree700, weight: 700, style: "normal" },
      ],
    },
  );
};
