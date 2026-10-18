import { render } from "react-email";
import { describe, expect, it } from "vitest";
import { type WelcomeProgress, WelcomeEmail, describeWelcomeSubject } from "./WelcomeEmail";

const NOTHING_DONE: WelcomeProgress = { offer: false, tool: false, widget: false, request: false };

const renderWelcome = (step: "j0" | "j1" | "j3" | "j7", progress: WelcomeProgress = NOTHING_DONE, plainText = false) =>
  render(
    <WelcomeEmail
      step={step}
      spaceCreatedAt={new Date("2026-10-12T08:06:00Z")}
      progress={progress}
      appUrl="https://pulsacity.com"
      unsubscribeUrl="https://pulsacity.com/api/unsubscribe/accueil?token=abc"
    />,
    plainText ? { plainText: true } : undefined,
  );

describe("WelcomeEmail", () => {
  it("J0 welcomes the creator and leads to the offers, the three steps to do", async () => {
    const html = await renderWelcome("j0");

    expect(describeWelcomeSubject("j0", "Julie Nutrition")).toBe("Votre espace Julie Nutrition est prêt");
    expect(html).toContain("Bienvenue dans PULSACITY.");
    expect(html.match(/href="https:\/\/pulsacity\.com\/app\/offres"/g)).toHaveLength(2);
    expect(html).toContain("Créer mon offre");
    expect(html).not.toContain("\u00a0: fait");
    expect(html).toContain('lang="fr"');
  });

  it("J1 ticks the offer done and leads to the connectors, with the way of the collection link", async () => {
    const html = await renderWelcome("j1", { ...NOTHING_DONE, offer: true });

    expect(html).toContain("Votre offre est prête. Prochaine étape\u00a0: l&#x27;outil où vous encaissez.");
    expect(html).toContain("Créer votre offre\u00a0: fait");
    expect(html).toContain("Connecter mon outil");
    expect(html).toContain('href="https://pulsacity.com/app/connecteurs"');
    expect(html).toContain('href="https://pulsacity.com/app"');
  });

  it("J1 does not say the offer is ready when it is not", async () => {
    const html = await renderWelcome("j1");

    expect(html).not.toContain("Votre offre est prête");
    expect(html).toContain("Prochaine étape\u00a0: l&#x27;outil où vous encaissez.");
  });

  it("J3 leads to the widgets and to the guide of Systeme.io; J7 opens « Demander un avis »", async () => {
    const j3 = await renderWelcome("j3", { ...NOTHING_DONE, offer: true, tool: true });
    const j7 = await renderWelcome("j7", { ...NOTHING_DONE, offer: true, tool: true });

    expect(j3).toContain("Vos ventes arrivent. Dernière étape");
    expect(j3).toContain('href="https://pulsacity.com/guides/ajouter-des-temoignages-sur-une-page-systeme-io"');
    expect(j7).toContain('href="https://pulsacity.com/app/demandes?demander=1"');
    expect(j7).toContain("C&#x27;est le dernier e-mail d&#x27;accueil.");
  });

  it("says why it arrives and how to stop it, with no installation time", async () => {
    for (const step of ["j0", "j1", "j3", "j7"] as const) {
      const text = await renderWelcome(step, NOTHING_DONE, true);
      expect(text).toContain("parce que vous avez créé votre espace PULSACITY le 12 oct. 2026");
      expect(text).toContain("Ne plus recevoir les e-mails d'accueil");
      expect(text).toContain("https://pulsacity.com/api/unsubscribe/accueil?token=abc");
      expect(text).not.toMatch(/minute|seconde/);
    }
  });
});
