import type { SupabaseClient } from "@supabase/supabase-js";
import type { DiagnosticoResult } from "./types";

/**
 * Gravação compatível com diagnostico.html → profiles
 */
export async function saveDiagnosticoToProfile(
  // Cliente browser — tipagem completa virá com supabase gen types
  supabase: SupabaseClient,
  userId: string,
  result: DiagnosticoResult
): Promise<{ error: Error | null }> {
  const { labels, storage, nivelId, nivel } = result;
  const nivelNome =
    storage.nivelNome || `Nível ${nivelId}`;

  const observacoesPayload = {
    nivel: `${nivelId} - ${nivelNome}`,
    nivelDigital: storage.nivelDigital,
    nivelCultural: storage.nivelCultural,
    diagnosticoData: storage.data,
    gamification: storage.gamification,
    progress: storage.progress,
    version: 2,
  };

  const { error } = await supabase
    .from("profiles")
    .update({
      aptidoes: [labels.tipoVisual, labels.ferramentas, labels.relacaoIA],
      objetivo: [labels.objetivo, labels.referenciaCultural],
      horarios: { frequencia: labels.frequenciaCriacao },
      origem: "Diagnóstico Criativo",
      onboarding_completo: true,
      observacoes: JSON.stringify(observacoesPayload),
    })
    .eq("id", userId);

  return { error: error ? new Error(error.message) : null };
}
