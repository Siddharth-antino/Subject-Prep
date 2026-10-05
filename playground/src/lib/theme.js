import { readCompatibleSetting } from "./storageCompatibility.js";
export const THEME_KEY = "subject-prep.theme";
export const THEME_OPTIONS = ["system", "light", "dark"];
export function normalizeTheme(value) {
  return THEME_OPTIONS.includes(value) ? value : "system";
}
export function resolveTheme(preference, systemDark) {
  return preference === "system" ? (systemDark ? "dark" : "light") : preference;
}
export function readTheme() {
  try {
    return normalizeTheme(readCompatibleSetting(THEME_KEY));
  } catch {
    return "system";
  }
}
