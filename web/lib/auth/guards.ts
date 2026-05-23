import { redirect } from "next/navigation";
import { getSessionProfile } from "./session";
import type { Profile } from "@/types/domain";

export async function requireUser(locale: string): Promise<Profile> {
  const profile = await getSessionProfile();
  if (!profile) {
    redirect(`/login.html?next=/${locale}/app`);
  }
  return profile;
}

export async function requireOnboardingComplete(
  locale: string
): Promise<Profile> {
  const profile = await requireUser(locale);
  if (!profile.onboarding_completo) {
    redirect(`/${locale}/onboarding/diagnostico`);
  }
  return profile;
}

export async function requireAdmin(locale: string): Promise<Profile> {
  const profile = await requireUser(locale);
  if (profile.role !== "admin" && profile.role !== "founder") {
    redirect(`/${locale}/app`);
  }
  return profile;
}
