import { getInitials } from "@/lib/spaces/get-initials";

type ConnectorLogoProps = {
  name: string;
};

/** Maquette 5 leaves the platform's logo to come: until then, its initial in a tile. */
export const ConnectorLogo = ({ name }: ConnectorLogoProps) => (
  <span
    aria-hidden="true"
    className="flex size-[48px] shrink-0 items-center justify-center rounded-sm border border-hairline-200 bg-paper-100 font-serif text-quote font-semibold desktop:size-[56px]"
  >
    {getInitials(name.replace(/\..*$/, "")).slice(0, 1)}
  </span>
);
