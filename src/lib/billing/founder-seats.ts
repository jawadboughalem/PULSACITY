import { count } from "drizzle-orm";
import { FOUNDER_PRICE_SEATS, type PriceList, readOpenPriceList } from "@/config/plans";
import type { Database } from "@/db/database";
import { founderSeats } from "@/db/schema";

/** The paying subscribers who took the founder price, beta testers apart (arbitrages.md, n° 1). */
export const countFounderSeats = async (database: Database): Promise<number> => {
  const [row] = await database.select({ value: count() }).from(founderSeats);
  return row?.value ?? 0;
};

/** « founder » until the hundredth seat is taken, « public » after: the prices the site shows and a new subscriber gets. */
export const readCurrentPriceList = async (database: Database): Promise<PriceList> =>
  readOpenPriceList(await countFounderSeats(database));

/** A space that pays the founder price takes a seat, once: true when this seat closed the founder price. */
export const takeFounderSeat = async (database: Database, spaceId: string): Promise<boolean> => {
  const taken = await database
    .insert(founderSeats)
    .values({ spaceId })
    .onConflictDoNothing({ target: founderSeats.spaceId })
    .returning({ id: founderSeats.id });
  if (taken.length === 0) return false;
  return (await countFounderSeats(database)) === FOUNDER_PRICE_SEATS;
};
