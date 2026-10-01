import Image from "next/image";

const LOGO_RATIO = 225.48 / 53.8;

const LOGO_SOURCES = {
  regular: "/brand/pulsacity-logo.svg",
  small: "/brand/pulsacity-logo-petit.svg",
} as const;

type BrandLogoProps = {
  /** "small" below 32 px of displayed height, as the identity v2 specification requires. */
  variant: keyof typeof LOGO_SOURCES;
  height: number;
  alt: "" | "Pulsacity";
  className?: string;
};

export const BrandLogo = ({ variant, height, alt, className }: BrandLogoProps) => (
  <Image
    src={LOGO_SOURCES[variant]}
    alt={alt}
    width={Math.round(height * LOGO_RATIO)}
    height={height}
    unoptimized
    priority
    className={className}
  />
);
