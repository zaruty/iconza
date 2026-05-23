import { DIAGNOSTICO_STORAGE_KEY } from "./constants";
import type { DiagnosticoStoragePayload } from "./types";

export function saveDiagnosticoLocal(payload: DiagnosticoStoragePayload) {
  if (typeof window === "undefined") return;
  localStorage.setItem(DIAGNOSTICO_STORAGE_KEY, JSON.stringify(payload));
}

export function readDiagnosticoLocal(): DiagnosticoStoragePayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(DIAGNOSTICO_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DiagnosticoStoragePayload;
  } catch {
    return null;
  }
}

/** Compat: payloads antigos sem gamification */
export function normalizeDiagnosticoLocal(
  data: DiagnosticoStoragePayload & Record<string, unknown>
): DiagnosticoStoragePayload {
  if (data.gamification && data.progress) return data;
  const nivelId = (data.nivelId ?? 1) as DiagnosticoStoragePayload["nivelId"];
  return {
    ...data,
    gamification: data.gamification ?? {
      xpEarned: nivelId * 100,
      creativeLevel: nivelId,
      unlockedUniverseSlugs: [],
      aiRecommendationTags: [],
    },
    progress: data.progress ?? {
      completedAt: data.data ?? new Date().toISOString(),
      questionsTotal: 8,
      questionsAnswered: 8,
      scorePercent: 0,
    },
  };
}
