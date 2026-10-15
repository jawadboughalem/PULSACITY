import { describe, expect, it } from "vitest";
import {
  buildCheckoutPath,
  decodePlanChoice,
  describeReturnToBilling,
  encodePlanChoice,
  parsePlanChoice,
} from "./billing-paths";
import { parseBillingError, parseCheckoutSessionId, parsePlanWelcome } from "./billing-notices";

describe("billing paths", () => {
  it("writes the plan and the period in French words in the address", () => {
    expect(buildCheckoutPath({ plan: "essentiel", period: "yearly" })).toBe("/app/facturation/payer?plan=essentiel&periode=annuel");
    expect(describeReturnToBilling({ abandoned: { plan: "pro", period: "monthly" } })).toBe(
      "/app/facturation?paiement=abandonne&plan=pro&periode=mensuel",
    );
  });

  it("reads back only a paid plan and a known period", () => {
    expect(parsePlanChoice("pro", "mensuel")).toEqual({ plan: "pro", period: "monthly" });
    expect(parsePlanChoice("free", "mensuel")).toBeNull();
    expect(parsePlanChoice("pro", "hebdomadaire")).toBeNull();
    expect(parsePlanChoice(undefined, undefined)).toBeNull();
  });

  it("keeps the choice of Tarifs in a cookie across the sign-up", () => {
    expect(decodePlanChoice(encodePlanChoice({ plan: "essentiel", period: "yearly" }))).toEqual({
      plan: "essentiel",
      period: "yearly",
    });
    expect(decodePlanChoice("essentiel")).toBeNull();
    expect(decodePlanChoice(undefined)).toBeNull();
  });

  it("reads the notices of the page, and nothing else", () => {
    expect(parseCheckoutSessionId("cs_test_a1B2c3")).toBe("cs_test_a1B2c3");
    expect(parseCheckoutSessionId("cs_test_<script>")).toBeNull();
    expect(parseCheckoutSessionId(["cs_test_a1"])).toBeNull();
    expect(parseBillingError("portail")).toBe("portal");
    expect(parseBillingError("autre")).toBeNull();
    expect(parsePlanWelcome("pro")).toBe("pro");
    expect(parsePlanWelcome("free")).toBeNull();
  });
});
