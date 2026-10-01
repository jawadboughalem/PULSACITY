import { afterEach, describe, expect, it, vi } from "vitest";
import { readDeploymentOrigins, readDeploymentUrl } from "./read-deployment-url";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("readDeploymentUrl", () => {
  it("reads the configured address in production and on localhost", () => {
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("VERCEL_BRANCH_URL", "pulsacity-git-main-team.vercel.app");
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://pulsacity.com/");

    expect(readDeploymentUrl("NEXT_PUBLIC_APP_URL")).toBe("https://pulsacity.com");
  });

  it("keeps a preview on its own branch address, even when the production one is configured", () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("VERCEL_BRANCH_URL", "pulsacity-git-claude-recette-team.vercel.app");
    vi.stubEnv("BETTER_AUTH_URL", "https://pulsacity.com");

    expect(readDeploymentUrl("BETTER_AUTH_URL")).toBe("https://pulsacity-git-claude-recette-team.vercel.app");
    expect(readDeploymentUrl("NEXT_PUBLIC_APP_URL")).toBe("https://pulsacity-git-claude-recette-team.vercel.app");
  });

  it("trusts the branch and deployment addresses of a preview only", () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("VERCEL_BRANCH_URL", "pulsacity-git-claude-recette-team.vercel.app");
    vi.stubEnv("VERCEL_URL", "pulsacity-abc123-team.vercel.app");
    expect(readDeploymentOrigins()).toEqual([
      "https://pulsacity-git-claude-recette-team.vercel.app",
      "https://pulsacity-abc123-team.vercel.app",
    ]);

    vi.stubEnv("VERCEL_ENV", "production");
    expect(readDeploymentOrigins()).toEqual([]);
  });
});
