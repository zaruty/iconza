import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ next?: string }>;
};

/**
 * Login Next — redireciona para login.html em /public (legacy compatível).
 */
export default async function LoginPage({ searchParams }: Props) {
  const { next } = await searchParams;
  const target = next
    ? `/login.html?next=${encodeURIComponent(next)}`
    : "/login.html";
  redirect(target);
}
