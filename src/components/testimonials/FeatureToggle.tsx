import { ICON_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

type FeatureToggleProps = {
  isFeatured: boolean;
  authorName: string;
  onToggle: () => void;
  className?: string;
};

/** Charte v2, « En avant »: an icon button with the bookmark (aria-pressed), on Soleil once the testimonial is put first. */
export const FeatureToggle = ({ isFeatured, authorName, onToggle, className }: FeatureToggleProps) => (
  <button
    type="button"
    aria-pressed={isFeatured}
    aria-label={`Mettre en avant l'avis de ${authorName}`}
    onClick={onToggle}
    className={cn(
      ICON_BUTTON_CLASSES,
      "relative",
      isFeatured && "bg-sun hover:bg-sun-hover active:bg-sun-pressed",
      className,
    )}
  >
    <Icon name="bookmark" size={20} />
  </button>
);
