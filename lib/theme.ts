export type Theme = "light" | "dark";

export const themeStorageKey = "rmp-theme";
export const languageStorageKey = "rmp-language";

export function detectPreferredTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}
