export const formatSender = (displayName: string, address: string): string => {
  const quotedName = displayName
    .replace(/[\r\n]+/g, " ")
    .trim()
    .replace(/["\\]/g, "\\$&");
  return `"${quotedName}" <${address}>`;
};
