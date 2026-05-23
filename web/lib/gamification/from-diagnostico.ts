import type { DiagnosticoStoragePayload } from "@/features/onboarding/diagnostico/types";
import type { GamificationState } from "@/types/domain";
import { readDiagnosticoLocal, normalizeDiagnosticoLocal } from "@/features/onboarding/diagnostico/storage";

/**
 * Converte diagnóstico (localStorage ou observacoes) em estado de gamificação.
 * Usado pelo dashboard e recomendações futuras.
 */
export function gamificationFromDiagnostico(
  payload: DiagnosticoStoragePayload | null
): GamificationState | null {
  if (!payload) return null;

  const g = payload.gamification;
  return {
    xp: g?.xpEarned ?? payload.nivelId * 100,
    level: g?.creativeLevel ?? payload.nivelId,
    streakDays: 0,
    achievementIds: [],
    creativeLevel: payload.nivelId,
  };
}

export function getGamificationFromBrowser(): GamificationState | null {
  const raw = readDiagnosticoLocal();
  if (!raw) return null;
  return gamificationFromDiagnostico(normalizeDiagnosticoLocal(raw));
}
