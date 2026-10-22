import type { Metadata } from "next";
import type { CollectionPage } from "./load-collection-page";

const readTitle = (page: CollectionPage | null): string => {
  if (!page) return "Page introuvable · PULSACITY";
  if (page.status === "review-saved" || page.status === "review-removed") return `Gérer mon avis · ${page.space.name}`;
  return `Votre avis pour ${page.space.name}`;
};

export const buildCollectionMetadata = (page: CollectionPage | null): Metadata => ({
  title: readTitle(page),
  robots: { index: false, follow: false },
});
