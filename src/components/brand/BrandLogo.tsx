import Image from "next/image";

const LOGO_RATIO = 225.48 / 53.8;

const LOGO_SOURCES = {
  regular: "/brand/pulsacity-logo.svg",
  small: "/brand/pulsacity-logo-petit.svg",
} as const;

/** Identity v2: on Encre, the « -sombre » files. */
const LOGO_SOURCES_ON_INK = {
  regular: "/brand/pulsacity-logo-sombre.svg",
  small: "/brand/pulsacity-logo-petit-sombre.svg",
} as const;

type BrandLogoProps = {
  /** "small" below 32 px of displayed height, as the identity v2 specification requires. */
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
    width={Math.round(height * LOGO_RATIO)}
    height={height}
    unoptimized
    priority={isPriority}
    className={className}
  />
);
