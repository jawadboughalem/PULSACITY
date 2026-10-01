import { readDeploymentUrl } from "@/lib/environment/read-deployment-url";

export const getAppUrl = (): string => readDeploymentUrl("NEXT_PUBLIC_APP_URL");

export const buildCollectionUrl = (spaceSlug: string, productSlug?: string): string =>
  `${getAppUrl()}/t/${spaceSlug}${productSlug ? `/${productSlug}` : ""}`;

export const displayUrl = (url: string): string => url.replace(/^https?:\/\//, "");
