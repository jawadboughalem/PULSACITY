import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { cn } from "./cn";

const stylesheet = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

function tokenNames(namespace: string): string[] {
  const names = [...stylesheet.matchAll(new RegExp(`--${namespace}-([a-z0-9]+(?:-[a-z0-9]+)*)(?:--[a-z-]+)?:`, "g"))];
  return [...new Set(names.map(([, name]) => name))];
}

describe("cn", () => {
  it("keeps every text size of the theme next to a text colour", () => {
    const sizes = tokenNames("text");
    expect(sizes.length).toBeGreaterThan(0);
    for (const size of sizes) {
      expect(cn(`text-${size}`, "text-ink")).toBe(`text-${size} text-ink`);
    }
  });

  it("lets the last text size win over every other one", () => {
    const sizes = tokenNames("text");
    for (const size of sizes) {
      expect(cn(`text-${size}`, "text-body")).toBe("text-body");
    }
  });

  it("merges every other scale of the theme with itself", () => {
    const scales: Array<[namespace: string, utility: string]> = [
      ["spacing", "px"],
      ["radius", "rounded"],
      ["shadow", "shadow"],
      ["container", "max-w"],
      ["font-weight", "font"],
    ];
    for (const [namespace, utility] of scales) {
      const [first, ...rest] = tokenNames(namespace);
      for (const name of rest) {
        expect(cn(`${utility}-${first}`, `${utility}-${name}`)).toBe(`${utility}-${name}`);
      }
    }
  });

  it("keeps a font family next to a font weight", () => {
    expect(cn("font-display", "font-bold")).toBe("font-display font-bold");
    expect(cn("font-display", "font-sans")).toBe("font-sans");
  });
});
