import { render } from "react-email";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { WidgetCodeEmail } from "./WidgetCodeEmail";

const SNIPPET = '<div data-pulsacity-widget="abc"></div><script async src="https://pulsacity.com/w.js"></script>';

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://pulsacity.com");
});

describe("WidgetCodeEmail", () => {
  it("carries the code to paste, escaped, and readable as plain text", async () => {
    const html = await render(<WidgetCodeEmail snippet={SNIPPET} />);
    const text = await render(<WidgetCodeEmail snippet={SNIPPET} />, { plainText: true });

    expect(html).toContain("&lt;div data-pulsacity-widget=&quot;abc&quot;&gt;&lt;/div&gt;");
    expect(html).not.toContain('<script async src="https://pulsacity.com/w.js"');
    expect(text).toContain('data-pulsacity-widget="abc"');
  });

  it("carries the guide for Systeme.io, its four steps in order, without a duration (maquettes 3.6)", async () => {
    const text = (await render(<WidgetCodeEmail snippet={SNIPPET} />, { plainText: true }))
      .replaceAll("\u2060", "")
      .replaceAll("\u00a0", " ");

    expect(text).toContain(
      "Collez-le une seule fois sur votre page de vente : vos réglages s'appliquent ensuite tout seuls.",
    );
    expect(text).toContain("Coller dans Systeme.io, en 4 étapes");
    expect(text).not.toMatch(/minute|s'exécute/);
    expect(text).toContain("le widget n'apparaît pas dans l'éditeur");
    expect(text).toContain("Votre page est sur WordPress, Wix ou un autre outil ? Voir les guides");
    expect(text).toContain("https://pulsacity.com/guides");
    expect(text.indexOf("Dans l'éditeur de votre page Systeme.io")).toBeLessThan(text.indexOf("Cliquez sur l'élément"));
    expect(text.indexOf("Cliquez sur l'élément")).toBeLessThan(text.indexOf("Enregistrez la page, puis ouvrez son aperçu"));
  });
});
