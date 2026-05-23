/**
 * Contratos para IA — implementação via Edge Function (futuro).
 * Não importar SDKs de LLM no client.
 */

export type AiSessionRef = {
  userId: string;
  context: "onboarding" | "aula" | "dashboard" | "comunidade";
  refId?: string;
};

export type AiCompletionRequest = {
  session: AiSessionRef;
  prompt: string;
  locale: string;
};

export type AiCompletionResponse = {
  message: string;
  tokensUsed?: number;
};
