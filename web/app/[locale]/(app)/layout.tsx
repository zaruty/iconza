import { requireOnboardingComplete } from "@/lib/auth/guards";
import type { Locale } from "@/lib/i18n/config";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

/**
 * Área logada — exige sessão + onboarding_completo (Etapa 1).
 * AppShell virá na Etapa 2.
 */
export default async function AppAreaLayout({ children, params }: Props) {
  const { locale } = await params;
  await requireOnboardingComplete(locale as Locale);

  return (
    <div className="flex min-h-shell bg-canvas">
      <div className="flex flex-1 flex-col lg:pl-64">{children}</div>
    </div>
  );
}
