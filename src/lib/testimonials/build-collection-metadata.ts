import type { Metadata } from "next";
import type { CollectionPage } from "./load-collection-page";

export const buildCollectionMetadata = (page: CollectionPage | null): Metadata => ({
  title: page ? `Votre avis pour ${page.space.name}` : "Page introuvable · PULSACITY",
  robots: { index: false, follow: false },
});
