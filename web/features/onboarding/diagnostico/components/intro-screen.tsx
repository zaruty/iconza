"use client";

import { useTranslations } from "next-intl";
import { LEVEL_BAR_COLORS, LEVEL_BAR_HEIGHTS } from "../constants";
import styles from "../diagnostico.module.css";

type Props = {
  onStart: () => void;
};

export function IntroScreen({ onStart }: Props) {
  const t = useTranslations("onboarding.diagnostico");

  return (
    <div className={styles.intro}>
      <span className={styles.introEyebrow}>{t("intro.eyebrow")}</span>
      <h1 className={styles.introTitle}>
        {t("intro.titleLine1")}
        <br />
        {t("intro.titleLine2")}
      </h1>
      <div className={styles.niveisPreview} aria-hidden>
        {LEVEL_BAR_COLORS.map((color, i) => (
          <div
            key={color}
            className={styles.nivelBarra}
            style={{
              background: color,
              height: LEVEL_BAR_HEIGHTS[i],
            }}
          />
        ))}
      </div>
      <p className={styles.introDesc}>{t("intro.desc")}</p>
      <div className={styles.introInfo}>
        <div className={styles.infoItem}>
          <span>⏱</span> {t("intro.time")}
        </div>
        <div className={styles.infoItem}>
          <span>🎯</span> {t("intro.questions")}
        </div>
        <div className={styles.infoItem}>
          <span>👑</span> {t("intro.noWrong")}
        </div>
      </div>
      <button type="button" className={styles.btnComecar} onClick={onStart}>
        {t("intro.cta")} →
      </button>
    </div>
  );
}
