import { describe, expect, it } from "vitest";
import { SECONDARY_COMPACT_BUTTON_CLASSES } from "./button-styles";
import { READ_ONLY_FIELD_CLASSES, SELECT_CLASSES, TEXTAREA_CLASSES } from "./field-styles";
import { ACCOUNT_MENU_ITEM_CLASSES, MENU_ITEM_DANGER_CLASSES } from "./menu-styles";

const classesOf = (value: string) => value.split(" ");

/** A variant replaces the base value it changes: the stylesheet's order never decides between the two. */
describe("style variants", () => {
  it("puts the read-only field on Nuage, not on white", () => {
    expect(classesOf(READ_ONLY_FIELD_CLASSES)).toContain("bg-cloud");
    expect(classesOf(READ_ONLY_FIELD_CLASSES)).not.toContain("bg-white");
  });

  it("lets the text area grow from 160 px, with its own padding", () => {
    expect(classesOf(TEXTAREA_CLASSES)).not.toContain("h-[56px]");
    expect(classesOf(TEXTAREA_CLASSES)).not.toContain("px-4");
  });

  it("keeps room for the chevron of a list", () => {
    expect(classesOf(SELECT_CLASSES)).toEqual(expect.arrayContaining(["px-4", "pr-12"]));
  });

  it("makes the compact secondary button 44 high", () => {
    expect(classesOf(SECONDARY_COMPACT_BUTTON_CLASSES)).not.toContain("h-[52px]");
    expect(classesOf(SECONDARY_COMPACT_BUTTON_CLASSES)).toContain("h-[44px]");
  });
});

describe("menu options", () => {
  it("writes a destructive action in Erreur, Erreur fond when hovered", () => {
    expect(classesOf(MENU_ITEM_DANGER_CLASSES)).toEqual(expect.arrayContaining(["text-error", "hover:bg-error-surface"]));
    expect(classesOf(MENU_ITEM_DANGER_CLASSES)).not.toContain("text-ink");
    expect(classesOf(MENU_ITEM_DANGER_CLASSES)).not.toContain("hover:bg-sky");
  });

  it("writes the account menu in 15 px", () => {
    expect(classesOf(ACCOUNT_MENU_ITEM_CLASSES)).toContain("text-small");
    expect(classesOf(ACCOUNT_MENU_ITEM_CLASSES)).not.toContain("text-body");
  });
});
