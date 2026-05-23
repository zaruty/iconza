"use client";

import { useCallback, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { postOnboardingPath } from "@/lib/auth/paths";
import type { Locale } from "@/lib/i18n/config";
import type { CreativeLevel } from "@/types/domain";
import { QUESTIONS, TOTAL_QUESTIONS } from "./constants";
import { calculateDiagnosticoResult } from "./calculate-result";
import { saveDiagnosticoToProfile } from "./save-diagnostico";
import { saveDiagnosticoLocal } from "./storage";
import type { Answers, DiagnosticoResult } from "./types";
import { DiagnosticoNav } from "./components/diagnostico-nav";
import { IntroScreen } from "./components/intro-screen";
import { QuestionScreen } from "./components/question-screen";
import { ResultScreen } from "./components/result-screen";
import styles from "./diagnostico.module.css";

type Phase = "intro" | "question" | "result";

type Props = {
  locale: Locale;
  userId: string;
  userRole: string | null;
};

export function DiagnosticoQuiz({ locale, userId, userRole }: Props) {
  const t = useTranslations("onboarding.diagnostico");
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [phase, setPhase] = useState<Phase>("intro");
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [result, setResult] = useState<DiagnosticoResult | null>(null);
  const [continuing, setContinuing] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const levelNames = useMemo(() => {
    const map = {} as Record<CreativeLevel, string>;
    for (let i = 1; i <= 7; i++) {
      const level = i as CreativeLevel;
      map[level] = t(`levels.${level}.name`);
    }
    return map;
  }, [t]);

  const levelDescs = useMemo(() => {
    const map = {} as Record<CreativeLevel, string>;
    for (let i = 1; i <= 7; i++) {
      const level = i as CreativeLevel;
      map[level] = t(`levels.${level}.desc`);
    }
    return map;
  }, [t]);

  const progressPct = useMemo(() => {
    if (phase === "intro") return 0;
    if (phase === "result") return 100;
    return ((stepIndex) / TOTAL_QUESTIONS) * 100;
  }, [phase, stepIndex]);

  const currentQuestion = QUESTIONS[stepIndex];

  const handleStart = () => {
    setPhase("question");
    setStepIndex(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelect = (value: number) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const finishQuiz = useCallback(async () => {
    const computed = calculateDiagnosticoResult(answers, levelNames, levelDescs);
    saveDiagnosticoLocal(computed.storage);

    const { error } = await saveDiagnosticoToProfile(
      supabase,
      userId,
      computed
    );
    if (error) {
      console.error("Erro ao salvar diagnóstico:", error);
      setSaveError(t("errors.save"));
    }

    setResult(computed);
    setPhase("result");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [answers, levelDescs, levelNames, supabase, t, userId]);

  const handleQuestionNext = () => {
    if (stepIndex < TOTAL_QUESTIONS - 1) {
      setStepIndex((i) => i + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      void finishQuiz();
    }
  };

  const handleBack = () => {
    if (stepIndex > 0) {
      setStepIndex((i) => i - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleContinue = async () => {
    setContinuing(true);
    const dest = postOnboardingPath(userRole, locale);
    router.push(dest);
    router.refresh();
  };

  const selectedValue = currentQuestion
    ? answers[currentQuestion.id]
    : undefined;

  return (
    <div className="min-h-screen bg-[#f7f5f2] font-sans text-[#1a1a1a]">
      <DiagnosticoNav progressPct={progressPct} />

      <div className={styles.wrap}>
        {saveError && (
          <p className="mb-4 text-center text-sm text-red-600" role="alert">
            {saveError}
          </p>
        )}

        {phase === "intro" && <IntroScreen onStart={handleStart} />}

        {phase === "question" && currentQuestion && (
          <QuestionScreen
            question={currentQuestion}
            index={stepIndex + 1}
            total={TOTAL_QUESTIONS}
            selected={selectedValue}
            onSelect={handleSelect}
            onBack={stepIndex > 0 ? handleBack : undefined}
            onNext={handleQuestionNext}
            nextDisabled={selectedValue === undefined}
            isLast={stepIndex === TOTAL_QUESTIONS - 1}
          />
        )}

        {phase === "result" && result && (
          <ResultScreen
            result={result}
            onContinue={() => void handleContinue()}
            continuing={continuing}
          />
        )}
      </div>
    </div>
  );
}
