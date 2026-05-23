import { getTranslations } from "next-intl/server";

/**
 * Placeholder — marketing virá de index.html ou nova landing em Etapa posterior.
 */
export default async function HomePage() {
  const t = await getTranslations("common");

  return (
    <main className="mx-auto flex min-h-shell max-w-page flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-xs font-medium uppercase tracking-widest text-ink-muted">
        ICONZA · Next.js
      </p>
      <h1 className="mt-4 font-serif text-4xl text-ink-strong md:text-5xl">
        {t("migrationScaffold")}
      </h1>
      <p className="mt-4 max-w-content text-lg text-ink-muted">
        {t("migrationHint")}
      </p>
      <nav className="mt-10 flex flex-col gap-3 sm:flex-row">
        <a
          href="/diagnostico.html"
          className="rounded-iconza border border-line px-6 py-3 text-sm text-ink-muted"
        >
          Legacy: diagnóstico
        </a>
        <a
          href="/dashboard.html"
          className="rounded-iconza border border-line px-6 py-3 text-sm text-ink-muted"
        >
          Legacy: dashboard
        </a>
      </nav>
    </main>
  );
}
