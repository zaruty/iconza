import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";

type CookieToSet = { name: string; value: string; options?: object };

export type MiddlewareSession = {
  response: NextResponse;
  supabase: SupabaseClient;
  user: { id: string } | null;
};

/**
 * Atualiza sessão Supabase e devolve cliente para guards no middleware.
 */
export async function getMiddlewareSession(
  request: NextRequest
): Promise<MiddlewareSession> {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { response, supabase, user };
}

/** @deprecated use getMiddlewareSession */
export async function updateSession(request: NextRequest) {
  const { response } = await getMiddlewareSession(request);
  return response;
}
