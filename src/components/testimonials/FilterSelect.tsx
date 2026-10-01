import { Icon } from "@/components/ui/Icon";
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
};

/** Desktop: the select under its label. Mobile: a chip showing the label, over an invisible native select. */
export const FilterSelect = ({ name, label, options, value, onChange }: FilterSelectProps) => {
  const selected = options.find((option) => option.value === value);
  const isFiltered = value !== "" && selected !== undefined;

  return (
    <label className="relative flex flex-col gap-2 max-desktop:max-w-full">
      <span className="text-small font-semibold max-desktop:sr-only">{label}</span>
      <span
        aria-hidden="true"
        className={cn(
          "flex h-[48px] max-w-full items-center gap-2 rounded-sm border border-ink-900 px-3 text-body font-semibold whitespace-nowrap desktop:hidden",
          isFiltered ? "bg-ink-900 text-white" : "bg-white text-ink-900",
        )}
      >
        <span className="truncate">{isFiltered ? selected.label : label}</span>
        <Icon name="chevronDown" size={16} className="shrink-0" />
      </span>
      <span className="relative flex max-desktop:absolute max-desktop:inset-[0]">
        <select
          name={name}
          defaultValue={value}
          onChange={onChange}
          className="h-[48px] w-full appearance-none rounded-sm border border-gray-400 bg-white pr-7 pl-4 text-body text-ink-900 focus:border-2 focus:border-ink-900 focus:pl-[15px] focus:outline-none max-desktop:h-full max-desktop:opacity-[0] desktop:min-w-[176px]"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <Icon
          name="chevronDown"
          size={20}
          className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 max-desktop:hidden"
        />
      </span>
    </label>
  );
};
