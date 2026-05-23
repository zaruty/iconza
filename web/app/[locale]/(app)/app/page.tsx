import { getTranslations } from "next-intl/server";

/**
 * Dashboard — migrar dashboard.html (Etapa 4)
 */
export default async function DashboardPage() {
  const t = await getTranslations("dashboard");

  return (
    <main className="mx-auto max-w-page px-4 py-8 safe-bottom">
      <h1 className="font-serif text-3xl text-ink-strong md:text-4xl">
        {t("title")}
      </h1>
      <p className="mt-2 text-ink-muted">{t("placeholder")}</p>
    </main>
  );
}
