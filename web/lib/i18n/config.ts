export const routing = {
  locales: ["pt", "en", "it", "es", "fr"] as const,
  defaultLocale: "pt" as const,
  localePrefix: "always" as const,
};

export type Locale = (typeof routing.locales)[number];
