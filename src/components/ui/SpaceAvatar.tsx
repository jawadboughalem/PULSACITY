import Image from "next/image";
import { getInitials } from "@/lib/spaces/get-initials";
import { cn } from "@/lib/cn";

type SpaceAvatarProps = {
  name: string;
  logoUrl: string | null;
  size: 32 | 36 | 44 | 64;
  /** Charte v2, Avatar: Ciel without a photo, white when it sits on Ciel. */
  background: "sky" | "white";
  /** Without a logo, the initials on the creator's accent rather than Ciel (collect page, maquettes 3.6). */
  colors?: { background: string; text: string };
  className?: string;
};

/** Initials in Figtree 700: 12, 13, 15 or 20 px. */
const SIZE_CLASSES = {
  32: "size-[32px] text-[12px]",
  36: "size-[36px] text-[13px]",
  44: "size-[44px] text-[15px]",
  64: "size-[64px] text-[20px]",
} as const;

export const SpaceAvatar = ({ name, logoUrl, size, background, colors, className }: SpaceAvatarProps) => (
  <span
    aria-hidden="true"
    style={colors && !logoUrl ? { backgroundColor: colors.background, color: colors.text } : undefined}
    className={cn(
      "flex shrink-0 items-center justify-center overflow-hidden rounded-full leading-none font-bold text-ink",
      background === "white" ? "bg-white" : "bg-sky",
      SIZE_CLASSES[size],
      className,
    )}
  >
    {logoUrl ? (
      <Image src={logoUrl} alt="" width={size} height={size} unoptimized className="size-full object-cover" />
    ) : (
      getInitials(name)
    )}
  </span>
);
