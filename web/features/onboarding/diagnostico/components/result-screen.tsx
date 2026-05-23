"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { LEVEL_BAR_COLORS, LEVEL_BAR_HEIGHTS } from "../constants";
import type { DiagnosticoResult } from "../types";
import styles from "../diagnostico.module.css";

type Props = {
  result: DiagnosticoResult;
  onContinue: () => void;
  continuing: boolean;
};

export function ResultScreen({ result, onContinue, continuing }: Props) {
  const t = useTranslations("onboarding.diagnostico");
  const { nivelId, labels, storage } = result;
  const nivelNome = storage.nivelNome;
  const nivelDesc = storage.nivelDescricao;
  const nivel = result.nivel;

  const [barHeights, setBarHeights] = useState<number[]>(
    LEVEL_BAR_HEIGHTS.map(() => 0)
  );

  useEffect(() => {
    const timers = LEVEL_BAR_HEIGHTS.map((h, i) =>
      window.setTimeout(() => {
        setBarHeights((prev) => {
          const next = [...prev];
          next[i] = h;
          return next;
        });
      }, 100 + i * 80)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className={styles.resultado}>
      <span className={styles.introEyebrow}>{t("result.eyebrow")}</span>

      <div className={styles.resultBarra}>
        {LEVEL_BAR_COLORS.map((cor, i) => (
          <div
            key={cor}
            className={styles.resultBarraItem}
            style={{
              background: cor,
              height: barHeights[i],
              opacity: i + 1 <= nivelId ? 1 : 0.2,
              boxShadow:
                i + 1 === nivelId ? `0 0 12px ${cor}` : undefined,
            }}
          />
        ))}
      </div>

      <div
        className={styles.resultBadge}
        style={{
          background: `${nivel.color}15`,
          border: `1px solid ${nivel.color}`,
          color: nivel.color,
        }}
      >
        <span style={{ fontSize: "1.2rem" }}>{nivel.emoji}</span>
        <span className="text-xs font-bold uppercase tracking-widest">
          {t("result.levelBadge", { level: nivelId, name: nivelNome })}
        </span>
      </div>

      <h2 className={styles.resultTitulo}>{nivelNome}</h2>
      <p className={styles.resultSubtitulo}>{nivelDesc}</p>

      <div className={styles.gamificationStrip}>
        <span className={styles.xpBadge}>
          +{storage.gamification.xpEarned} XP
        </span>
        <span className={styles.xpBadge}>
          {t("result.universes", {
            count: storage.gamification.unlockedUniverseSlugs.length,
          })}
        </span>
      </div>

      <div className={styles.resultAttrs}>
        <div className={styles.attrCard}>
          <span className={styles.attrIcon}>🎨</span>
          <span className={styles.attrNome}>{t("result.attrVisual")}</span>
          <span className={styles.attrValor}>{labels.tipoVisual}</span>
        </div>
        <div className={styles.attrCard}>
          <span className={styles.attrIcon}>🤖</span>
          <span className={styles.attrNome}>{t("result.attrAi")}</span>
          <span className={styles.attrValor}>{labels.relacaoIA}</span>
        </div>
        <div className={styles.attrCard}>
          <span className={styles.attrIcon}>🎯</span>
          <span className={styles.attrNome}>{t("result.attrGoal")}</span>
          <span className={styles.attrValor}>{labels.objetivo}</span>
        </div>
      </div>

      <button
        type="button"
        className={styles.btnComecar}
        onClick={onContinue}
        disabled={continuing}
      >
        {continuing ? t("result.entering") : t("result.cta")} →
      </button>
    </div>
  );
}
