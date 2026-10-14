import { z } from "zod";
import { HEX_COLOR_PATTERN } from "@/lib/colors/contrast-ratio";
import { replyToEmailSchema, spaceNameSchema, spaceSlugSchema } from "./new-space-form-schema";

export const MAX_POSTAL_ADDRESS_LENGTH = 200;

export const MAX_POSTAL_ADDRESS_LINES = 5;

const ACCENT_COLOR_MESSAGE = "Écrivez la couleur avec # et six caractères, par exemple #4F6F52, ou choisissez-la dans le carré.";

/** Typed by hand: « 4f6f52 » is « #4F6F52 ». Empty: no accent, the widgets take the colour of the page's links. */
const accentColorSchema = z
  .string()
  .trim()
  .transform((color) => (color === "" || color.startsWith("#") ? color : `#${color}`))
  .pipe(
    z.union([z.literal(""), z.string().regex(HEX_COLOR_PATTERN, { error: ACCENT_COLOR_MESSAGE })], {
      error: ACCENT_COLOR_MESSAGE,
    }),
  )
  .transform((color) => (color === "" ? null : color.toUpperCase()));

/** One line per line typed, without the empty ones. Empty: no address. */
const postalAddressSchema = z
  .string()
  .transform((address) =>
    address
      .split(/\r?\n/)
      .map((line) => line.trim().replace(/\s+/g, " "))
      .filter(Boolean)
      .join("\n"),
  )
  .pipe(
    z
      .string()
      .max(MAX_POSTAL_ADDRESS_LENGTH, {
        error: `Cette adresse dépasse ${MAX_POSTAL_ADDRESS_LENGTH} caractères. Raccourcissez-la.`,
      })
      .refine((address) => address.split("\n").length <= MAX_POSTAL_ADDRESS_LINES, {
        error: `Écrivez l'adresse sur ${MAX_POSTAL_ADDRESS_LINES} lignes au plus.`,
      }),
  )
  .transform((address) => (address === "" ? null : address));

/** A hidden field of the form: "true" or "false". */
const booleanFieldSchema = z.enum(["true", "false"]).transform((value) => value === "true");

/**
 * Réglages: the space, its e-mails to customers, its notifications. The logo is either kept, replaced by a new upload
 * (logoKey), or removed.
 */
export const spaceSettingsFormSchema = z.object({
  name: spaceNameSchema,
  slug: spaceSlugSchema,
  accentColor: accentColorSchema,
  replyToEmail: replyToEmailSchema,
  senderPostalAddress: postalAddressSchema,
  newTestimonialEmailEnabled: booleanFieldSchema,
  offersIncentive: booleanFieldSchema,
  logoKey: z.string().default(""),
  removeLogo: booleanFieldSchema.default(false),
});

export type SpaceSettingsForm = z.infer<typeof spaceSettingsFormSchema>;

/** The fields that can be wrong, in the order of the page. */
export const SPACE_SETTINGS_FIELDS = ["name", "logoKey", "accentColor", "slug", "replyToEmail", "senderPostalAddress"] as const;

export type SpaceSettingsField = (typeof SPACE_SETTINGS_FIELDS)[number];

export type SpaceSettingsFieldErrors = Partial<Record<SpaceSettingsField, string>>;

export const collectSpaceSettingsErrors = (error: z.ZodError): SpaceSettingsFieldErrors => {
  const { fieldErrors } = z.flattenError(error) as { fieldErrors: Partial<Record<string, string[]>> };
  return Object.fromEntries(
    SPACE_SETTINGS_FIELDS.flatMap((field) => {
      const message = fieldErrors[field]?.[0];
      return message ? [[field, message]] : [];
    }),
  );
};

/** « Julie Martin · 12 rue des Lilas · 69003 Lyon », at the bottom of an e-mail. */
export const formatPostalAddressLine = (address: string): string => address.split("\n").join(" · ");
