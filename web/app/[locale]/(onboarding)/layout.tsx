import { DM_Sans, Playfair_Display } from "next/font/google";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-dm-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700", "900"],
  variable: "--font-playfair",
});

/**
 * Layout minimalista — sem AppShell.
 * Espelha diagnostico.html / onboarding.html (nav topo + progresso).
 */
export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${dmSans.variable} ${playfair.variable} min-h-shell bg-[#f7f5f2] font-sans`}
    >
      {children}
    </div>
  );
}
