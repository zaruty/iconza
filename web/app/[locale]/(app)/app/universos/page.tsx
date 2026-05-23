import { getTranslations } from "next-intl/server";

/**
 * Universos — lista cursos (Etapa 5). Schema: cursos
 */
export default async function UniversosPage() {
  const t = await getTranslations("universos");

  return (
    <main className="mx-auto max-w-page px-4 py-8 safe-bottom">
      <h1 className="font-serif text-3xl text-ink-strong">{t("title")}</h1>
      <p className="mt-2 text-ink-muted">{t("placeholder")}</p>
    </main>
  );
}
