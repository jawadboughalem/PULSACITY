import type { Metadata } from "next";
import { CollectionPageContent, loadCollectionPageOnce } from "@/components/collect/CollectionPageContent";
import { buildCollectionMetadata } from "@/lib/testimonials/build-collection-metadata";
import { readRequestToken } from "@/lib/testimonials/read-request-token";

export const generateMetadata = async ({ params, searchParams }: PageProps<"/t/[spaceSlug]">): Promise<Metadata> => {
  const { spaceSlug } = await params;
  return buildCollectionMetadata(await loadCollectionPageOnce(spaceSlug, null, readRequestToken(await searchParams)));
};

const SpaceCollectionPage = async ({ params, searchParams }: PageProps<"/t/[spaceSlug]">) => {
  const { spaceSlug } = await params;
  return (
    <CollectionPageContent spaceSlug={spaceSlug} productSlug={null} requestToken={readRequestToken(await searchParams)} />
  );
};

export default SpaceCollectionPage;
