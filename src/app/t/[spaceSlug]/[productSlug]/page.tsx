import type { Metadata } from "next";
import { CollectionPageContent, loadCollectionPageOnce } from "@/components/collect/CollectionPageContent";
import { buildCollectionMetadata } from "@/lib/testimonials/build-collection-metadata";
import { readRequestToken } from "@/lib/testimonials/read-request-token";

export const generateMetadata = async ({
  params,
  searchParams,
}: PageProps<"/t/[spaceSlug]/[productSlug]">): Promise<Metadata> => {
  const { spaceSlug, productSlug } = await params;
  return buildCollectionMetadata(
    await loadCollectionPageOnce(spaceSlug, productSlug, readRequestToken(await searchParams)),
  );
};

const ProductCollectionPage = async ({ params, searchParams }: PageProps<"/t/[spaceSlug]/[productSlug]">) => {
  const { spaceSlug, productSlug } = await params;
  return (
    <CollectionPageContent
      spaceSlug={spaceSlug}
      productSlug={productSlug}
      requestToken={readRequestToken(await searchParams)}
    />
  );
};

export default ProductCollectionPage;
