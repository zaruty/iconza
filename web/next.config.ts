import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./lib/i18n/request.ts");

/**
 * Migração gradual: redirects ativados por etapa.
 * Descomente cada bloco quando a rota Next estiver pronta em produção.
 */
const nextConfig: NextConfig = {
  // Coexistência com HTML na raiz do monorepo (deploy separado ou rewrites Vercel)
  async redirects() {
    const useNextOnboarding =
      process.env.NEXT_PUBLIC_USE_NEXT_ONBOARDING === "true";

    return [
      ...(useNextOnboarding
        ? [
            {
              source: "/diagnostico.html",
              destination: "/pt/onboarding/diagnostico",
              permanent: false,
            },
          ]
        : []),
      // Fase 4 — dashboard
      // {
      //   source: "/dashboard.html",
      //   destination: "/pt/app",
      //   permanent: false,
      // },
    ];
  },
};

export default withNextIntl(nextConfig);
