import { NextResponse, type NextRequest } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Locale } from "@/lib/i18n/config";
import { routing } from "@/lib/i18n/config";
import {
  appDashboardPath,
  diagnosticoPath,
  getLocaleFromPathname,
  isAppRoute,
  isDiagnosticoRoute,
  isOnboardingArea,
  loginPath,
  postOnboardingPath,
} from "./paths";

type ProfileGate = {
  onboarding_completo: boolean | null;
  role: string | null;
};

export async function applyAuthGuards(
  request: NextRequest,
  response: NextResponse,
  supabase: SupabaseClient,
  user: { id: string } | null
): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  const locale =
    getLocaleFromPathname(pathname) ?? routing.defaultLocale;

  const needsAuth =
    isAppRoute(pathname) ||
    isOnboardingArea(pathname);

  if (!needsAuth) {
    return response;
  }

  if (!user) {
    return NextResponse.redirect(
      new URL(loginPath(pathname), request.url),
      { headers: response.headers }
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completo, role")
    .eq("id", user.id)
    .maybeSingle();

  const gate = profile as ProfileGate | null;

  if (isAppRoute(pathname)) {
    if (!gate?.onboarding_completo) {
      return NextResponse.redirect(
        new URL(diagnosticoPath(locale as Locale), request.url),
        { headers: response.headers }
      );
    }
    return response;
  }

  if (isDiagnosticoRoute(pathname) && gate?.onboarding_completo) {
    return NextResponse.redirect(
      new URL(postOnboardingPath(gate.role, locale as Locale), request.url),
      { headers: response.headers }
    );
  }

  return response;
}
