// Application constants
export const APP_NAME = "My V0 Project";
export const VERSION = "0.1.0";

export const THEME_MODES = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
} as const;

export const API_ENDPOINTS = {
  PROTECTED: "/api/protected",
} as const;

export const ROUTES = {
  HOME: "/",
  PROTECTED: "/protected",
} as const;
