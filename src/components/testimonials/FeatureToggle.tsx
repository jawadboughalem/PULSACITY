import { ICON_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { prefixPersonWithDe } from "@/lib/french/prefix-with-de";

type FeatureToggleProps = {
  isFeatured: boolean;
  authorName: string;
  onToggle: () => void;
  className?: string;
};

/**
 * Charte v2, « En avant »: an icon button with the bookmark (aria-pressed), circled in Encre (maquettes 3.4), on Soleil
 * once the testimonial is put first.
 */
export const FeatureToggle = ({ isFeatured, authorName, onToggle, className }: FeatureToggleProps) => (
  <button
    type="button"
    aria-pressed={isFeatured}
    aria-label={`Mettre en avant l'avis ${prefixPersonWithDe(authorName)}`}
    onClick={onToggle}
    className={cn(
      ICON_BUTTON_CLASSES,
      "relative border-2",
      isFeatured ? "border-sun bg-sun hover:border-sun-hover hover:bg-sun-hover active:bg-sun-pressed" : "border-ink",
      className,
    )}
  >
    <Icon name="bookmark" size={20} />
  </button>
);
