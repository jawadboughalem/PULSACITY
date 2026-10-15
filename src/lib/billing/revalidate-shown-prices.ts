import { revalidatePath } from "next/cache";
import { MARKETING_PATHS } from "@/components/marketing/marketing-paths";

/** The pages that show the prices: the hundredth founder seat switches them to the public prices at once. */
export const SHOWN_PRICE_PATHS = [MARKETING_PATHS.home, MARKETING_PATHS.pricing];

export const revalidateShownPrices = (): void => {
  for (const path of SHOWN_PRICE_PATHS) revalidatePath(path);
};
