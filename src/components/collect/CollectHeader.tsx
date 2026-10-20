import { SpaceAvatar } from "@/components/ui/SpaceAvatar";
import { cn } from "@/lib/cn";
import { readAccentButtonColors } from "@/lib/colors/accent-button-colors";

type CollectHeaderProps = {
  spaceName: string;
  logoUrl: string | null;
  accentColor?: string | null;
  className?: string;
};

/**
 * Maquettes 3.6, « Couleur d'accent du créateur »: the logo 44 in its round and the name 17/26 700. Without a logo, the
 * initials on the accent (white at 4.5:1, otherwise Encre); without an accent, on Ciel.
 */
export const CollectHeader = ({ spaceName, logoUrl, accentColor = null, className }: CollectHeaderProps) => {
  const accent = readAccentButtonColors(accentColor);
  return (
    <header className={cn("flex items-center gap-3", className)}>
      <SpaceAvatar
        name={spaceName}
        logoUrl={logoUrl}
        size={44}
        background="sky"
        colors={accent ? { background: accent.background, text: accent.text } : undefined}
      />
      <p className="min-w-[0] text-body font-bold break-words">{spaceName}</p>
    </header>
  );
};
