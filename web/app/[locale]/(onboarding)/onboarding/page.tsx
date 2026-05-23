import { getTranslations } from "next-intl/server";

/**
 * Etapa 3 — migrar onboarding.html (CRM multi-step)
 */
export default async function OnboardingCrmPage() {
  const t = await getTranslations("onboarding.crm");

  return (
    <main className="mx-auto max-w-content px-4 py-12">
      <h1 className="font-serif text-3xl text-ink-strong">{t("title")}</h1>
      <p className="mt-4 text-ink-muted">{t("placeholder")}</p>
    </main>
  );
}
