/**
 * NAV_ALUNA — espelhado de iconza-sidebar.js
 * IDs devem bater com IconzaUtils.getCurrentPage() durante migração.
 */
export type NavItem = {
  id: string;
  labelKey: string;
  href: string;
  icon: string;
};

export const NAV_ALUNA: NavItem[] = [
  { id: "boas-vindas", labelKey: "nav.dashboard", href: "/app", icon: "home" },
  {
    id: "universos",
    labelKey: "nav.universos",
    href: "/app/universos",
    icon: "compass",
  },
  {
    id: "cerebro",
    labelKey: "nav.cerebro",
    href: "/app/cerebro",
    icon: "brain",
  },
  { id: "cursos", labelKey: "nav.cursos", href: "/app/cursos", icon: "book" },
  { id: "comunidade", labelKey: "nav.comunidade", href: "/app/comunidade", icon: "users" },
  { id: "config", labelKey: "nav.config", href: "/app/config", icon: "settings" },
];
