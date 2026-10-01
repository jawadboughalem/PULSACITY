import { describe, expect, it } from "vitest";
import { decodeCsvFile } from "./decode-csv-file";

describe("decodeCsvFile", () => {
  it("reads UTF-8 and drops the byte order mark", () => {
    expect(decodeCsvFile(new TextEncoder().encode("﻿nom;texte\nInès;Très bien"))).toBe("nom;texte\nInès;Très bien");
  });

  it("falls back to Windows-1252 for an old Excel file", () => {
    const windows1252 = new Uint8Array([0x49, 0x6e, 0xe8, 0x73, 0x3b, 0x9c, 0x75, 0x76, 0x72, 0x65]);

    expect(decodeCsvFile(windows1252)).toBe("Inès;œuvre");
  });
});
