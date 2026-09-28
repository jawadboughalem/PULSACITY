import { z } from "zod";
import { HEX_COLOR_PATTERN } from "@/lib/colors/contrast-ratio";
import { MAX_SLUG_LENGTH, MIN_SLUG_LENGTH, SLUG_PATTERN } from "./slugify";

export const MAX_SPACE_NAME_LENGTH = 60;

const SLUG_MESSAGE = "Utilisez des lettres minuscules, des chiffres et des tirets, par exemple julie-nutrition.";

const ACCENT_COLOR_MESSAGE = "Choisissez la couleur dans le sélecteur.";

export const newSpaceFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { error: "Indiquez le nom de votre activité." })
    .max(MAX_SPACE_NAME_LENGTH, { error: `Ce nom dépasse ${MAX_SPACE_NAME_LENGTH} caractères. Raccourcissez-le.` }),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(MIN_SLUG_LENGTH, { error: SLUG_MESSAGE })
    .max(MAX_SLUG_LENGTH, { error: SLUG_MESSAGE })
    .regex(SLUG_PATTERN, { error: SLUG_MESSAGE }),
  replyToEmail: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email({ error: "Cette adresse e-mail est incomplète. Écrivez-la en entier, par exemple julie@exemple.fr." })),
  accentColor: z
    .union([z.literal(""), z.string().regex(HEX_COLOR_PATTERN, { error: ACCENT_COLOR_MESSAGE })], {
      error: ACCENT_COLOR_MESSAGE,
    })
    .transform((color) => (color === "" ? null : color.toUpperCase())),
  logoKey: z.string().default(""),
});

export type NewSpaceField = keyof z.infer<typeof newSpaceFormSchema>;

export type NewSpaceFieldErrors = Partial<Record<NewSpaceField, string>>;

export const collectFirstFieldErrors = (error: z.ZodError<z.infer<typeof newSpaceFormSchema>>): NewSpaceFieldErrors => {
  const { fieldErrors } = z.flattenError(error);
  return {
    name: fieldErrors.name?.[0],
    slug: fieldErrors.slug?.[0],
    replyToEmail: fieldErrors.replyToEmail?.[0],
    accentColor: fieldErrors.accentColor?.[0],
    logoKey: fieldErrors.logoKey?.[0],
  };
};
