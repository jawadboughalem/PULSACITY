import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        "display",
        "h1",
        "h2",
        "quote",
        "body",
        "small",
        "legal",
        "logo-96",
        "logo-72",
        "logo-28",
        "logo-22",
        "logo-15",
      ],
      spacing: ["page-gutter"],
      shadow: ["relief", "float"],
      container: ["text", "quote"],
      tracking: ["title"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
