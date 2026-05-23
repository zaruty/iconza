import type { CreativeLevel } from "@/types/domain";

export type QuestionId =
  | "q1"
  | "q2"
  | "q3"
  | "q4"
  | "q5"
  | "q6"
  | "q7"
  | "q8";

export type Answers = Partial<Record<QuestionId, number>>;

export type CreativeLevelInfo = {
  id: CreativeLevel;
  nameKey: string;
  emoji: string;
  color: string;
  descKey: string;
};

export type MappedLabels = {
  tipoVisual: string;
  relacaoIA: string;
  objetivo: string;
  referenciaCultural: string;
  ferramentas: string;
  frequenciaCriacao: string;
};

/** Payload localStorage — chave iconza_diagnostico (legacy + Next) */
export type DiagnosticoStoragePayload = {
  nivelId: CreativeLevel;
  nivelNome: string;
  nivelCor: string;
  nivelEmoji: string;
  nivelDescricao: string;
  nivelDigital: number;
  nivelCultural: number;
  tipoVisual: string;
  relacaoIA: string;
  objetivo: string;
  referenciaCultural: string;
  ferramentas: string;
  frequenciaCriacao: string;
  respostasRaw: Answers;
  data: string;
  gamification: DiagnosticoGamification;
  progress: DiagnosticoProgress;
};

export type DiagnosticoGamification = {
  xpEarned: number;
  creativeLevel: CreativeLevel;
  /** IDs de universos desbloqueados (futuro: tabela cursos) */
  unlockedUniverseSlugs: string[];
  /** Tags para recomendação IA */
  aiRecommendationTags: string[];
};

export type DiagnosticoProgress = {
  completedAt: string;
  questionsTotal: number;
  questionsAnswered: number;
  scorePercent: number;
};

export type DiagnosticoResult = {
  nivel: CreativeLevelInfo;
  nivelId: CreativeLevel;
  labels: MappedLabels;
  storage: DiagnosticoStoragePayload;
};

export type QuestionKind = "grid" | "list" | "scale";

export type QuestionOption = {
  value: number;
  emoji?: string;
  labelKey: string;
  descKey?: string;
};

export type QuestionDefinition = {
  id: QuestionId;
  kind: QuestionKind;
  sectionKey: string;
  titleKey: string;
  subtitleKey?: string;
  options: QuestionOption[];
  scaleMax?: number;
};
