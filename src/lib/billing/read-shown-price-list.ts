import type { PriceList } from "@/config/plans";
import { getDb } from "@/db";
import { readCurrentPriceList } from "./founder-seats";

/**
 * The prices the public pages show (arbitrage n° 1): the founder ones until the hundredth seat. The pages are rebuilt
 * every hour, and at once when the hundredth seat is taken. A build without its database (the CI) shows the founder
 * prices; a page rebuilt later reads the count, and keeps its last version if the database does not answer.
 */
export const readShownPriceList = async (): Promise<PriceList> => {
  const building = process.env.NEXT_PHASE === "phase-production-build";
  if (building && !process.env.DATABASE_URL) return "founder";
  try {
    return await readCurrentPriceList(getDb());
  } catch (error) {
    if (building) return "founder";
    throw error;
  }
};
