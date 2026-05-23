import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente browser — equivalente a window.sb (core-supabase.js)
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
