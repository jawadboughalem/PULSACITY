import { getInitials } from "@/lib/spaces/get-initials";

type ConnectorLogoProps = {
  name: string;
};

/** Maquette 5 leaves the platform's logo to come: until then, its initial in a tile. */
export const ConnectorLogo = ({ name }: ConnectorLogoProps) => (
  <span
    aria-hidden="true"
    className="flex size-[48px] shrink-0 items-center justify-center rounded-field bg-sky text-body font-bold text-ink desktop:size-[56px]"
  >
    {getInitials(name.replace(/\..*$/, "")).slice(0, 1)}
  </span>
);
