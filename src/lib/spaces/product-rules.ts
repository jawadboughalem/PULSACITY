import { z } from "zod";

export const MIN_PRODUCT_NAME_LENGTH = 2;

export const MAX_PRODUCT_NAME_LENGTH = 80;

export const productNameSchema = z.string().trim().min(MIN_PRODUCT_NAME_LENGTH).max(MAX_PRODUCT_NAME_LENGTH);

/** 0: the request leaves with the next run of the cron, right after the sale. */
export const MIN_REQUEST_DELAY_DAYS = 0;

export const MAX_REQUEST_DELAY_DAYS = 180;

export const requestDelayDaysSchema = z.coerce
  .number()
  .int()
  .min(MIN_REQUEST_DELAY_DAYS)
  .max(MAX_REQUEST_DELAY_DAYS);
