import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["display", "h1", "figure", "h2", "h3", "lead", "quote", "body", "small", "badge", "legal", "mention"],
      spacing: ["page-gutter", "space-nav", "tab-bar"],
      radius: ["check", "field", "card", "panel", "block", "net", "full"],
      shadow: ["float", "tab-bar"],
      container: ["text", "quote", "content"],
      font: ["display", "sans"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
