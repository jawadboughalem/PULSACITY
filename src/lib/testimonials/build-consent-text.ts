import { prefixWithDe } from "@/lib/french/prefix-with-de";

export const buildConsentText = (spaceName: string): string =>
  `J'accepte que ce témoignage soit publié sur les supports ${prefixWithDe(spaceName)}.`;
