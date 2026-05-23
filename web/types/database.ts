/**
 * Gerar com: npx supabase gen types typescript --project-id <id> > types/database.ts
 * Placeholder mínimo até rodar codegen contra o projeto real.
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          nome_completo: string | null;
          role: string | null;
          onboarding_completo: boolean | null;
          idioma: string | null;
          aptidoes: Json | null;
          objetivo: Json | null;
          horarios: Json | null;
          origem: string | null;
          observacoes: string | null;
          avatar_url: string | null;
          status: string | null;
          created_at: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
      };
      cursos: {
        Row: {
          id: string;
          titulo: string;
          slug: string;
          status: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["cursos"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["cursos"]["Row"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
