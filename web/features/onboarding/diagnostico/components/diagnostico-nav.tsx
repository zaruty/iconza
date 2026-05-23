"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

type Props = {
  progressPct: number;
};

export function DiagnosticoNav({ progressPct }: Props) {
  const t = useTranslations("onboarding.diagnostico");
  const locale = useLocale();

  return (
    <>
      <nav className="flex items-center justify-between bg-[#2d2d2d] px-4 py-4 sm:px-8">
        <Link href={`/${locale}`} className="flex items-center gap-2 no-underline">
          <span className="font-serif text-sm font-bold tracking-widest text-white">
            ICONZA
          </span>
        </Link>
        <span className="text-[0.68rem] uppercase tracking-widest text-white/30">
          {t("navLabel")}
        </span>
      </nav>
      <div className="relative h-[3px] bg-white/10">
        <div
          className="h-full bg-[#C1272D] transition-[width] duration-400 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>
    </>
  );
}
