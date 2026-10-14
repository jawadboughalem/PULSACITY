export type SpaceAccount = {
  /** The creator's name when known, otherwise the space's. */
  name: string;
  email: string;
  planName: string;
  logoUrl: string | null;
};
