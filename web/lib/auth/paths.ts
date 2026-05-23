import type { Locale } from "@/lib/i18n/config";

const LEGACY_LOGIN = "/login.html";
const LEGACY_ADMIN = "/admin-crm.html";
const LEGACY_DASHBOARD = "/dashboard.html";

/** Login servido por web/public/login.html no mesmo origin do Next */
export function loginPath(next?: string) {
  if (!next) return LEGACY_LOGIN;
  return `${LEGACY_LOGIN}?next=${encodeURIComponent(next)}`;
}

export function diagnosticoPath(locale: Locale) {
  return `/${locale}/onboarding/diagnostico`;
}

export function onboardingCrmPath(locale: Locale) {
  return `/${locale}/onboarding`;
}

export function appDashboardPath(locale: Locale) {
  return `/${locale}/app`;
}

export function postOnboardingPath(
  role: string | null | undefined,
  locale: Locale
): string {
  if (role === "admin" || role === "founder") {
    return LEGACY_ADMIN;
  }
  if (
    process.env.NEXT_PUBLIC_USE_NEXT_DASHBOARD === "true" ||
    process.env.NEXT_PUBLIC_USE_NEXT_ONBOARDING === "true"
  ) {
    return appDashboardPath(locale);
  }
  return LEGACY_DASHBOARD;
}

export function isAppRoute(pathname: string): boolean {
  return /\/(pt|en|it|es|fr)\/app(\/|$)/.test(pathname);
}

export function isDiagnosticoRoute(pathname: string): boolean {
  return /\/(pt|en|it|es|fr)\/onboarding\/diagnostico/.test(pathname);
}

export function isOnboardingArea(pathname: string): boolean {
  return /\/(pt|en|it|es|fr)\/onboarding/.test(pathname);
}

export function getLocaleFromPathname(pathname: string): Locale | null {
  const match = pathname.match(/^\/(pt|en|it|es|fr)(\/|$)/);
  return (match?.[1] as Locale) ?? null;
}
