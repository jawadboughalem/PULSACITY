import { FILTER_CHIP_CHOSEN_CLASSES, FILTER_CHIP_CLASSES } from "@/components/ui/chip-styles";
import { FIELD_LABEL_CLASSES } from "@/components/ui/field-styles";
import { Icon } from "@/components/ui/Icon";
import { SelectControl } from "@/components/ui/SelectControl";
import { cn } from "@/lib/cn";

export type FilterOption = {
  value: string;
  label: string;
};

type FilterSelectProps = {
  name: string;
  label: string;
  options: FilterOption[];
  value: string;
  onChange: () => void;
  /** On a computer, the select's width (maquettes 3.4: 190 for the status, 230 for the offer, 170 for the rating). */
  desktopWidthClassName?: string;
};

/**
 * Desktop: the select under its label. Mobile: a filter chip (40 high in a 44 zone) showing the label, over an
 * invisible native select; Soleil with its check once a filter is set.
 */
export const FilterSelect = ({ name, label, options, value, onChange, desktopWidthClassName }: FilterSelectProps) => {
  const selected = options.find((option) => option.value === value);
  const isFiltered = value !== "" && selected !== undefined;

  return (
    <label className="group relative flex flex-col gap-2 max-desktop:h-[44px] max-desktop:max-w-full max-desktop:justify-center">
      <span className={cn(FIELD_LABEL_CLASSES, "max-desktop:sr-only")}>{label}</span>
      <span
        aria-hidden="true"
        className={cn(
          FILTER_CHIP_CLASSES,
          "max-w-full group-hover:bg-sky group-has-focus-visible:outline-2 group-has-focus-visible:outline-offset-3 group-has-focus-visible:outline-ink desktop:hidden",
          isFiltered && cn(FILTER_CHIP_CHOSEN_CLASSES, "group-hover:bg-sun-hover"),
        )}
      >
        {isFiltered ? <Icon name="check" size={16} /> : null}
        <span className="truncate">{isFiltered ? selected.label : label}</span>
        <Icon name="chevronDown" size={16} />
      </span>
      <span className="flex max-desktop:absolute max-desktop:inset-[0] max-desktop:opacity-[0]">
        <SelectControl
          name={name}
          defaultValue={value}
          onChange={onChange}
          className={cn("max-desktop:h-full", desktopWidthClassName ?? "desktop:min-w-[176px]")}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </SelectControl>
      </span>
    </label>
  );
};
