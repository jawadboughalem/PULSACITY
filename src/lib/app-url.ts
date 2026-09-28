import { readRequiredEnvironmentVariable } from "@/lib/environment/read-required-environment-variable";

export const getAppUrl = (): string =>
  readRequiredEnvironmentVariable("NEXT_PUBLIC_APP_URL").replace(/\/+$/, "");

export const buildCollectionUrl = (spaceSlug: string, productSlug?: string): string =>
  `${getAppUrl()}/t/${spaceSlug}${productSlug ? `/${productSlug}` : ""}`;

export const displayUrl = (url: string): string => url.replace(/^https?:\/\//, "");
