import { getRequestConfig } from "next-intl/server";
import { routing, type Locale } from "./config";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as Locale)) {
    locale = routing.defaultLocale;
  }

  const pt = (await import("@/messages/pt.json")).default;
  const localeMessages =
    locale === "pt"
      ? pt
      : {
          ...pt,
          ...((await import(`@/messages/${locale}.json`)).default as object),
        };

  return {
    locale,
    messages: localeMessages,
  };
});
