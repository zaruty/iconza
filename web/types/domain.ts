import type { Database } from "./database";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export type UserRole =
  | "founder"
  | "admin"
  | "mentor"
  | "aluno"
  | "visitante";

export type CreativeLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7;

/** Estado de gamificação — tabelas conquistas/XP virão no Supabase */
export interface GamificationState {
  xp: number;
  level: number;
  streakDays: number;
  achievementIds: string[];
  creativeLevel: CreativeLevel;
}

/** Stub para integração IA futura */
export interface AiMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
}
