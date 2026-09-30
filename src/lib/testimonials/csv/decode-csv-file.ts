const BYTE_ORDER_MARK = "﻿";

/** Excel on Windows still saves CSV in Windows-1252 when it is not asked for UTF-8. */
export const decodeCsvFile = (bytes: ArrayBuffer | Uint8Array): string => {
  let text: string;
  try {
    text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    text = new TextDecoder("windows-1252").decode(bytes);
  }
  return text.startsWith(BYTE_ORDER_MARK) ? text.slice(BYTE_ORDER_MARK.length) : text;
};
