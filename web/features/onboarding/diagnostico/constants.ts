import type { CreativeLevelInfo, QuestionDefinition } from "./types";

export const DIAGNOSTICO_STORAGE_KEY = "iconza_diagnostico";
export const TOTAL_QUESTIONS = 8;

export const CREATIVE_LEVELS: CreativeLevelInfo[] = [
  { id: 1, nameKey: "levels.1.name", emoji: "🔴", color: "#8B0000", descKey: "levels.1.desc" },
  { id: 2, nameKey: "levels.2.name", emoji: "🔴", color: "#C1272D", descKey: "levels.2.desc" },
  { id: 3, nameKey: "levels.3.name", emoji: "🟠", color: "#E85D20", descKey: "levels.3.desc" },
  { id: 4, nameKey: "levels.4.name", emoji: "🟡", color: "#F5A623", descKey: "levels.4.desc" },
  { id: 5, nameKey: "levels.5.name", emoji: "🟢", color: "#90C030", descKey: "levels.5.desc" },
  { id: 6, nameKey: "levels.6.name", emoji: "💚", color: "#20A860", descKey: "levels.6.desc" },
  { id: 7, nameKey: "levels.7.name", emoji: "💙", color: "#1878C8", descKey: "levels.7.desc" },
];

export const LEVEL_BAR_COLORS = [
  "#8B0000",
  "#C1272D",
  "#E85D20",
  "#F5A623",
  "#90C030",
  "#20A860",
  "#1878C8",
];

export const LEVEL_BAR_HEIGHTS = [40, 50, 62, 76, 62, 50, 40];

/** Universos desbloqueados por nível (preparado para tabela cursos) */
export const UNIVERSE_UNLOCK_BY_LEVEL: Record<number, string[]> = {
  1: ["faisca-fundamentos"],
  2: ["faisca-fundamentos", "brasa-expressao"],
  3: ["faisca-fundamentos", "brasa-expressao", "chama-metodo"],
  4: ["faisca-fundamentos", "brasa-expressao", "chama-metodo", "luz-equilibrio"],
  5: ["faisca-fundamentos", "brasa-expressao", "chama-metodo", "luz-equilibrio", "brilho-autoral"],
  6: ["faisca-fundamentos", "brasa-expressao", "chama-metodo", "luz-equilibrio", "brilho-autoral", "estrela-impacto"],
  7: ["faisca-fundamentos", "brasa-expressao", "chama-metodo", "luz-equilibrio", "brilho-autoral", "estrela-impacto", "icone-referencia"],
};

export const QUESTIONS: QuestionDefinition[] = [
  {
    id: "q1",
    kind: "grid",
    sectionKey: "questions.q1.section",
    titleKey: "questions.q1.title",
    subtitleKey: "questions.q1.subtitle",
    options: [
      { value: 1, emoji: "📱", labelKey: "questions.q1.o1.label", descKey: "questions.q1.o1.desc" },
      { value: 2, emoji: "🎨", labelKey: "questions.q1.o2.label", descKey: "questions.q1.o2.desc" },
      { value: 3, emoji: "🎬", labelKey: "questions.q1.o3.label", descKey: "questions.q1.o3.desc" },
      { value: 4, emoji: "🖼", labelKey: "questions.q1.o4.label", descKey: "questions.q1.o4.desc" },
    ],
  },
  {
    id: "q2",
    kind: "list",
    sectionKey: "questions.q2.section",
    titleKey: "questions.q2.title",
    options: [
      { value: 1, labelKey: "questions.q2.o1.label", descKey: "questions.q2.o1.desc" },
      { value: 2, labelKey: "questions.q2.o2.label", descKey: "questions.q2.o2.desc" },
      { value: 3, labelKey: "questions.q2.o3.label", descKey: "questions.q2.o3.desc" },
      { value: 4, labelKey: "questions.q2.o4.label", descKey: "questions.q2.o4.desc" },
    ],
  },
  {
    id: "q3",
    kind: "grid",
    sectionKey: "questions.q3.section",
    titleKey: "questions.q3.title",
    subtitleKey: "questions.q3.subtitle",
    options: [
      { value: 1, emoji: "🌸", labelKey: "questions.q3.o1.label", descKey: "questions.q3.o1.desc" },
      { value: 2, emoji: "👗", labelKey: "questions.q3.o2.label", descKey: "questions.q3.o2.desc" },
      { value: 3, emoji: "🍽", labelKey: "questions.q3.o3.label", descKey: "questions.q3.o3.desc" },
      { value: 4, emoji: "🎵", labelKey: "questions.q3.o4.label", descKey: "questions.q3.o4.desc" },
    ],
  },
  {
    id: "q4",
    kind: "list",
    sectionKey: "questions.q4.section",
    titleKey: "questions.q4.title",
    options: [
      { value: 1, labelKey: "questions.q4.o1.label", descKey: "questions.q4.o1.desc" },
      { value: 2, labelKey: "questions.q4.o2.label", descKey: "questions.q4.o2.desc" },
      { value: 3, labelKey: "questions.q4.o3.label", descKey: "questions.q4.o3.desc" },
      { value: 4, labelKey: "questions.q4.o4.label", descKey: "questions.q4.o4.desc" },
    ],
  },
  {
    id: "q5",
    kind: "grid",
    sectionKey: "questions.q5.section",
    titleKey: "questions.q5.title",
    options: [
      { value: 1, emoji: "🤔", labelKey: "questions.q5.o1.label", descKey: "questions.q5.o1.desc" },
      { value: 2, emoji: "🔍", labelKey: "questions.q5.o2.label", descKey: "questions.q5.o2.desc" },
      { value: 3, emoji: "⚡", labelKey: "questions.q5.o3.label", descKey: "questions.q5.o3.desc" },
      { value: 4, emoji: "🚀", labelKey: "questions.q5.o4.label", descKey: "questions.q5.o4.desc" },
    ],
  },
  {
    id: "q6",
    kind: "scale",
    sectionKey: "questions.q6.section",
    titleKey: "questions.q6.title",
    subtitleKey: "questions.q6.subtitle",
    options: [],
    scaleMax: 7,
  },
  {
    id: "q7",
    kind: "scale",
    sectionKey: "questions.q7.section",
    titleKey: "questions.q7.title",
    subtitleKey: "questions.q7.subtitle",
    options: [],
    scaleMax: 7,
  },
  {
    id: "q8",
    kind: "list",
    sectionKey: "questions.q8.section",
    titleKey: "questions.q8.title",
    options: [
      { value: 1, labelKey: "questions.q8.o1.label", descKey: "questions.q8.o1.desc" },
      { value: 2, labelKey: "questions.q8.o2.label", descKey: "questions.q8.o2.desc" },
      { value: 3, labelKey: "questions.q8.o3.label", descKey: "questions.q8.o3.desc" },
      { value: 4, labelKey: "questions.q8.o4.label", descKey: "questions.q8.o4.desc" },
    ],
  },
];

/** Labels legíveis — índices alinhados ao HTML legacy */
export const LABEL_MAPS = {
  tipoVisual: [
    "Stories/Reels",
    "Design Gráfico",
    "Vídeo Editado",
    "Arte Conceitual",
  ],
  relacaoIA: [
    "Iniciante em IA",
    "Explorando IA",
    "Usuária Regular de IA",
    "Referência em IA",
  ],
  objetivo: [
    "Criação de Conteúdo",
    "Identidade Autoral",
    "Monetização com IA",
    "Repertório Cultural",
  ],
  referenciaCultural: ["Frida Kahlo", "Coco Chanel", "Julia Child", "Nina Simone"],
  ferramentas: [
    "Celular/Apps básicos",
    "Canva/CapCut",
    "IA (ChatGPT/Midjourney)",
    "Adobe Suite",
  ],
  frequenciaCriacao: ["Raramente", "1-2x por mês", "Toda semana", "Todo dia"],
} as const;
