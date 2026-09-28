export const MIN_ACCENT_CONTRAST_RATIO = 3;

export const HEX_COLOR_PATTERN = /^#[0-9a-fA-F]{6}$/;

const toLinearChannel = (hexPair: string) => {
  const channel = Number.parseInt(hexPair, 16) / 255;
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
};

const calculateRelativeLuminance = (hexColor: string) =>
  0.2126 * toLinearChannel(hexColor.slice(1, 3)) +
  0.7152 * toLinearChannel(hexColor.slice(3, 5)) +
  0.0722 * toLinearChannel(hexColor.slice(5, 7));

export const calculateContrastRatio = (firstColor: string, secondColor: string): number => {
  const [lighter, darker] = [calculateRelativeLuminance(firstColor), calculateRelativeLuminance(secondColor)].sort(
    (first, second) => second - first,
  );
  return (lighter + 0.05) / (darker + 0.05);
};
