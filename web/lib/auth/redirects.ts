import type { Profile } from "@/types/domain";

/**
 * Espelha redirecionarAposLogin() de login.html
 */
export function getPostLoginPath(
  profile: Pick<Profile, "role" | "onboarding_completo"> | null,
  locale = "pt"
): string {
  if (!profile) {
    return `/${locale}/onboarding/diagnostico`;
  }

  if (profile.role === "admin" || profile.role === "founder") {
    return "/admin-crm.html"; // legacy até migrar admin
  }

  if (!profile.onboarding_completo) {
    return `/${locale}/onboarding/diagnostico`;
  }

  return `/${locale}/app`;
}

export function getOnboardingPath(locale = "pt") {
  return `/${locale}/onboarding`;
}
