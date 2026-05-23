"use client";

import { useTranslations } from "next-intl";
import type { QuestionDefinition } from "../types";
import styles from "../diagnostico.module.css";
import { cn } from "@/lib/utils/cn";

type Props = {
  question: QuestionDefinition;
  index: number;
  total: number;
  selected?: number;
  onSelect: (value: number) => void;
  onBack?: () => void;
  onNext: () => void;
  nextDisabled: boolean;
  isLast: boolean;
};

export function QuestionScreen({
  question,
  index,
  total,
  selected,
  onSelect,
  onBack,
  onNext,
  nextDisabled,
  isLast,
}: Props) {
  const t = useTranslations("onboarding.diagnostico");

  return (
    <div className={styles.question}>
      <div className={styles.qHeader}>
        <span className={styles.qNum}>
          {t("questionOf", { current: index, total })}
          {" — "}
          {t(question.sectionKey)}
        </span>
        <h2 className={styles.qTitle}>{t(question.titleKey)}</h2>
        {question.subtitleKey && (
          <p className={styles.qSubtitle}>{t(question.subtitleKey)}</p>
        )}
      </div>

      {question.kind === "grid" && (
        <div className={styles.opcoesGrid}>
          {question.options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={cn(
                styles.opcao,
                selected === opt.value && styles.opcaoSelected
              )}
              onClick={() => onSelect(opt.value)}
            >
              {opt.emoji && (
                <div className={styles.opcaoPlaceholder}>{opt.emoji}</div>
              )}
              <div className={styles.opcaoBody}>
                <span className={styles.opcaoLabel}>{t(opt.labelKey)}</span>
                {opt.descKey && (
                  <span className={styles.opcaoDesc}>{t(opt.descKey)}</span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {question.kind === "list" && (
        <div className={styles.opcoesLista}>
          {question.options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={cn(
                styles.opcaoTexto,
                selected === opt.value && styles.opcaoTextoSelected
              )}
              onClick={() => onSelect(opt.value)}
            >
              <span className={styles.opcaoCheck}>
                {selected === opt.value ? "✓" : ""}
              </span>
              <div>
                <div className={styles.opcaoLabel}>{t(opt.labelKey)}</div>
                {opt.descKey && (
                  <div className={styles.opcaoDesc}>{t(opt.descKey)}</div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {question.kind === "scale" && (
        <div className={styles.escalaBtns}>
          {Array.from({ length: question.scaleMax ?? 7 }, (_, i) => i + 1).map(
            (n) => (
              <button
                key={n}
                type="button"
                className={cn(
                  styles.escalaBtn,
                  selected === n && styles.escalaBtnSelected
                )}
                onClick={() => onSelect(n)}
              >
                {n}
              </button>
            )
          )}
        </div>
      )}

      <div className={styles.qNav}>
        {onBack ? (
          <button type="button" className={styles.btnVoltar} onClick={onBack}>
            ← {t("back")}
          </button>
        ) : (
          <div />
        )}
        <button
          type="button"
          className={styles.btnAvancar}
          disabled={nextDisabled}
          onClick={onNext}
        >
          {isLast ? t("seeResult") : t("next")} →
        </button>
      </div>
    </div>
  );
}
