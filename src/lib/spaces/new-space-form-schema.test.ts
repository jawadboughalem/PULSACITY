import { assert, describe, expect, it } from "vitest";
import { collectFirstFieldErrors, newSpaceFormSchema } from "./new-space-form-schema";

const VALID_FORM = {
  name: "  Julie Nutrition ",
  slug: "Julie-Nutrition",
  replyToEmail: " Julie@Exemple.fr",
  accentColor: "#a3243b",
  logoKey: "",
};

describe("newSpaceFormSchema", () => {
  it("cleans what the creator typed", () => {
    expect(newSpaceFormSchema.parse(VALID_FORM)).toEqual({
      name: "Julie Nutrition",
      slug: "julie-nutrition",
      replyToEmail: "julie@exemple.fr",
      accentColor: "#A3243B",
      logoKey: "",
    });
  });

  it("keeps no accent colour when none was chosen", () => {
    expect(newSpaceFormSchema.parse({ ...VALID_FORM, accentColor: "" }).accentColor).toBeNull();
  });

  it("explains every field to correct, in French", () => {
    const parsed = newSpaceFormSchema.safeParse({
      name: "J",
      slug: "julie nutrition!",
      replyToEmail: "julie@",
      accentColor: "rouge",
      logoKey: "",
    });
    assert(!parsed.success);

    expect(collectFirstFieldErrors(parsed.error)).toEqual({
      name: "Indiquez le nom de votre activité.",
      slug: "Utilisez des lettres minuscules, des chiffres et des tirets, par exemple julie-nutrition.",
      replyToEmail: "Cette adresse e-mail est incomplète. Écrivez-la en entier, par exemple julie@exemple.fr.",
      accentColor: "Choisissez la couleur dans le sélecteur.",
      logoKey: undefined,
    });
  });
});
