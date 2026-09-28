import Image from "next/image";
import { getInitials } from "@/lib/spaces/get-initials";
import { cn } from "@/lib/cn";

type SpaceAvatarProps = {
  name: string;
  logoUrl: string | null;
  size: 36 | 44 | 64;
  background: "white" | "paper";
};

const SIZE_CLASSES = {
  36: "size-[36px] text-small leading-none",
  44: "size-[44px] text-body leading-none",
  64: "size-[64px] text-quote leading-none",
} as const;

export const SpaceAvatar = ({ name, logoUrl, size, background }: SpaceAvatarProps) => (
  <span
    aria-hidden="true"
    className={cn(
      "flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-hairline-200 font-serif font-semibold",
      background === "white" ? "bg-white" : "bg-paper-100",
      SIZE_CLASSES[size],
    )}
  >
    {logoUrl ? (
      <Image src={logoUrl} alt="" width={size} height={size} unoptimized className="size-full object-cover" />
    ) : (
      getInitials(name)
    )}
  </span>
);
