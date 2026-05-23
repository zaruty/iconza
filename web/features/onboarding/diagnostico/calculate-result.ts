import type { CreativeLevel } from "@/types/domain";
import {
  CREATIVE_LEVELS,
  LABEL_MAPS,
  TOTAL_QUESTIONS,
  UNIVERSE_UNLOCK_BY_LEVEL,
} from "./constants";
import type {
  Answers,
  DiagnosticoGamification,
  DiagnosticoProgress,
  DiagnosticoResult,
  DiagnosticoStoragePayload,
  MappedLabels,
} from "./types";

function pickLabel<T extends readonly string[]>(
  map: T,
  index: number
): string {
  return map[Math.max(0, Math.min(map.length - 1, index - 1))] ?? map[0];
}

export function mapAnswersToLabels(answers: Answers): MappedLabels {
  return {
    tipoVisual: pickLabel(LABEL_MAPS.tipoVisual, answers.q1 ?? 1),
    relacaoIA: pickLabel(LABEL_MAPS.relacaoIA, answers.q5 ?? 1),
    objetivo: pickLabel(LABEL_MAPS.objetivo, answers.q8 ?? 1),
    referenciaCultural: pickLabel(
      LABEL_MAPS.referenciaCultural,
      answers.q3 ?? 1
    ),
    ferramentas: pickLabel(LABEL_MAPS.ferramentas, answers.q2 ?? 1),
    frequenciaCriacao: pickLabel(
      LABEL_MAPS.frequenciaCriacao,
      answers.q4 ?? 1
    ),
  };
}

export function calculateCreativeLevel(answers: Answers): CreativeLevel {
  const digital = (answers.q2 ?? 1) + (answers.q5 ?? 1) + (answers.q6 ?? 1);
  const cultural = (answers.q3 ?? 1) + (answers.q7 ?? 1);
  const frequencia = answers.q4 ?? 1;
  const visual = answers.q1 ?? 1;

  const total = digital * 1.5 + cultural * 1.2 + frequencia + visual;
  const maxPossivel = (4 + 4 + 7) * 1.5 + (4 + 7) * 1.2 + 4 + 4;
  const pct = total / maxPossivel;

  if (pct < 0.15) return 1;
  if (pct < 0.28) return 2;
  if (pct < 0.42) return 3;
  if (pct < 0.56) return 4;
  if (pct < 0.7) return 5;
  if (pct < 0.85) return 6;
  return 7;
}

function buildGamification(
  nivelId: CreativeLevel,
  labels: MappedLabels,
  scorePercent: number
): DiagnosticoGamification {
  const baseXp = nivelId * 100;
  const completionBonus = 50;
  const xpEarned = baseXp + completionBonus;

  return {
    xpEarned,
    creativeLevel: nivelId,
    unlockedUniverseSlugs: UNIVERSE_UNLOCK_BY_LEVEL[nivelId] ?? [],
    aiRecommendationTags: [
      labels.tipoVisual,
      labels.relacaoIA,
      labels.objetivo,
      labels.referenciaCultural,
      labels.ferramentas,
      `score:${Math.round(scorePercent * 100)}`,
    ],
  };
}

export function calculateDiagnosticoResult(
  answers: Answers,
  levelNames: Record<CreativeLevel, string>,
  levelDescs: Record<CreativeLevel, string>
): DiagnosticoResult {
  const nivelId = calculateCreativeLevel(answers);
  const nivel = CREATIVE_LEVELS[nivelId - 1];
  const labels = mapAnswersToLabels(answers);

  const digital = (answers.q2 ?? 1) + (answers.q5 ?? 1) + (answers.q6 ?? 1);
  const cultural = (answers.q3 ?? 1) + (answers.q7 ?? 1);
  const frequencia = answers.q4 ?? 1;
  const visual = answers.q1 ?? 1;
  const total = digital * 1.5 + cultural * 1.2 + frequencia + visual;
  const maxPossivel = (4 + 4 + 7) * 1.5 + (4 + 7) * 1.2 + 4 + 4;
  const scorePercent = total / maxPossivel;

  const progress: DiagnosticoProgress = {
    completedAt: new Date().toISOString(),
    questionsTotal: TOTAL_QUESTIONS,
    questionsAnswered: Object.keys(answers).length,
    scorePercent,
  };

  const gamification = buildGamification(nivelId, labels, scorePercent);

  const storage: DiagnosticoStoragePayload = {
    nivelId,
    nivelNome: levelNames[nivelId],
    nivelCor: nivel.color,
    nivelEmoji: nivel.emoji,
    nivelDescricao: levelDescs[nivelId],
    nivelDigital: answers.q6 ?? 1,
    nivelCultural: answers.q7 ?? 1,
    tipoVisual: labels.tipoVisual,
    relacaoIA: labels.relacaoIA,
    objetivo: labels.objetivo,
    referenciaCultural: labels.referenciaCultural,
    ferramentas: labels.ferramentas,
    frequenciaCriacao: labels.frequenciaCriacao,
    respostasRaw: { ...answers },
    data: new Date().toISOString(),
    gamification,
    progress,
  };

  return {
    nivelId,
    nivel: { ...nivel, nameKey: nivel.nameKey },
    labels,
    storage,
  };
}
