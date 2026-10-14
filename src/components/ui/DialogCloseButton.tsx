import { cn } from "@/lib/cn";
import { ICON_BUTTON_CLASSES } from "./button-styles";
import { Icon } from "./Icon";

type DialogCloseButtonProps = {
  onClick: () => void;
  isDisabled?: boolean;
  className?: string;
};

/** The 44 cross « Fermer », top right of a window. */
export const DialogCloseButton = ({ onClick, isDisabled = false, className }: DialogCloseButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    disabled={isDisabled}
    aria-label="Fermer"
    className={cn(ICON_BUTTON_CLASSES, "-mt-2 -mr-2", className)}
  >
    <Icon name="close" size={24} />
  </button>
);
