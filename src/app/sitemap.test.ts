import { afterEach, describe, expect, it, vi } from "vitest";
import { GUIDES } from "@/content/guides";
import robots from "./robots";
import sitemap from "./sitemap";

afterEach(() => {
  vi.unstubAllEnvs();
});

const listPaths = () => sitemap().map((entry) => entry.url.replace("https://pulsacity.com", ""));

describe("sitemap", () => {
  it("lists the public pages on pulsacity.com, every guide and every connector", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://pulsacity.com");
    vi.stubEnv("LEGAL_VALIDATED", "false");
    const paths = listPaths();
    expect(paths).toEqual(
      expect.arrayContaining(["", "/tarifs", "/integrations", "/integrations/systeme-io", "/integrations/stripe", "/guides"]),
    );
    for (const guide of GUIDES) expect(paths).toContain(`/guides/${guide.slug}`);
  });

  it("leaves the legal drafts out until LEGAL_VALIDATED is true", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://pulsacity.com");
    vi.stubEnv("LEGAL_VALIDATED", "false");
    expect(listPaths()).not.toContain("/cgu");
    vi.stubEnv("LEGAL_VALIDATED", "true");
    expect(listPaths()).toEqual(expect.arrayContaining(["/mentions-legales", "/cgu", "/cgv", "/confidentialite"]));
  });

  it("falls back on pulsacity.com when no address is configured, as in CI", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "");
    expect(sitemap()[0].url).toBe("https://pulsacity.com");
  });
});

describe("robots", () => {
  it("keeps the space, the API and the collection pages out of search engines", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://pulsacity.com");
    expect(robots()).toEqual({
      rules: { userAgent: "*", allow: "/", disallow: ["/app/", "/api/", "/t/", "/desinscription"] },
      sitemap: "https://pulsacity.com/sitemap.xml",
    });
  });

  it("closes a preview to every crawler", () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    expect(robots()).toEqual({ rules: { userAgent: "*", disallow: "/" } });
  });
});
