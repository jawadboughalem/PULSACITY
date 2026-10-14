import Image from "next/image";

/** Width over height of each file's viewBox (docs-internes/design-v2/identite/logo/svg). */
const LOGO_RATIOS = {
  regular: 263.38 / 64,
  small: 272.83 / 64,
} as const;

const LOGO_SOURCES = {
  regular: "/brand/pulsacity-logo.svg",
  small: "/brand/pulsacity-logo-petit.svg",
} as const;

/** Logo v2 « Galet »: on Encre, the « -sombre » files. */
const LOGO_SOURCES_ON_INK = {
  regular: "/brand/pulsacity-logo-sombre.svg",
  small: "/brand/pulsacity-logo-petit-sombre.svg",
} as const;

type BrandLogoProps = {
  /** "small" from 20 to 31 px of displayed height, "regular" from 32 px (identity specification). */
  variant: keyof typeof LOGO_SOURCES;
  height: number;
  alt: "" | "Pulsacity";
  isOnInk?: boolean;
  /** Preloaded by default: the logo of a header is in the first screen. */
  isPriority?: boolean;
  className?: string;
};

export const BrandLogo = ({ variant, height, alt, isOnInk = false, isPriority = true, className }: BrandLogoProps) => (
  <Image
    src={(isOnInk ? LOGO_SOURCES_ON_INK : LOGO_SOURCES)[variant]}
    alt={alt}
    width={Math.round(height * LOGO_RATIOS[variant])}
    height={height}
    unoptimized
    priority={isPriority}
    className={className}
  />
);
