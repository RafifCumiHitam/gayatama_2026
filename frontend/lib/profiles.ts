export type FontKey = "system" | "lexend" | "atkinson" | "opendyslexic"
export type BackgroundKey = "white" | "warm" | "green" | "purple" | "dark"
export type ColumnKey = "narrow" | "wide" | "full"
export type AlignKey = "left" | "justify"

export interface ReadingSettings {
  font: FontKey
  fontSize: number // px
  lineHeight: number
  letterSpacing: number // em
  wordSpacing: number // em
  paragraphSpacing: number // em
  columnWidth: ColumnKey
  alignment: AlignKey
  background: BackgroundKey
  // Reading aids
  ruler: boolean
  focusLines: 0 | 1 | 3 | 5 // 0 = off
  highlightParagraph: boolean
  hideFootnotes: boolean
}

export const FONTS: { key: FontKey; label: string; stack: string }[] = [
  { key: "system", label: "System", stack: "var(--font-inter), system-ui, sans-serif" },
  { key: "lexend", label: "Lexend", stack: "var(--font-lexend), sans-serif" },
  {
    key: "atkinson",
    label: "Atkinson Hyperlegible",
    stack: "var(--font-atkinson), sans-serif",
  },
  { key: "opendyslexic", label: "OpenDyslexic", stack: '"OpenDyslexic", sans-serif' },
]

export const BACKGROUNDS: {
  key: BackgroundKey
  label: string
  aria: string
  surface: string
  ink: string
}[] = [
  { key: "white", label: "White", aria: "White reading background", surface: "#ffffff", ink: "#1c1c1c" },
  { key: "warm", label: "Warm", aria: "Warm reading background", surface: "#f4f2ee", ink: "#1c1c1c" },
  {
    key: "green",
    label: "Green tint",
    aria: "Green tint reading background",
    surface: "#e7ede7",
    ink: "#1b241d",
  },
  {
    key: "purple",
    label: "Purple tint",
    aria: "Purple tint reading background",
    surface: "#ece8f2",
    ink: "#211d29",
  },
  { key: "dark", label: "Dark", aria: "Dark reading background", surface: "#202020", ink: "#f4f2ee" },
]

export const COLUMNS: { key: ColumnKey; label: string; ch: number }[] = [
  { key: "narrow", label: "Narrow", ch: 52 },
  { key: "wide", label: "Wide", ch: 68 },
  { key: "full", label: "Full", ch: 92 },
]

export const DEFAULT_SETTINGS: ReadingSettings = {
  font: "system",
  fontSize: 18,
  lineHeight: 1.8,
  letterSpacing: 0.02,
  wordSpacing: 0,
  paragraphSpacing: 1.4,
  columnWidth: "narrow",
  alignment: "left",
  background: "warm",
  ruler: false,
  focusLines: 0,
  highlightParagraph: false,
  hideFootnotes: false,
}

export interface ReadingProfile {
  id: string
  name: string
  summary: string
  details: string[]
  settings: Partial<ReadingSettings>
}

export const PROFILES: ReadingProfile[] = [
  {
    id: "standard",
    name: "Standard",
    summary: "A clean, neutral reading layout close to the original document.",
    details: ["System font", "Normal spacing", "Normal width"],
    settings: {
      font: "system",
      fontSize: 18,
      lineHeight: 1.7,
      letterSpacing: 0.01,
      wordSpacing: 0,
      paragraphSpacing: 1.3,
      columnWidth: "wide",
      background: "warm",
      focusLines: 0,
    },
  },
  {
    id: "dyslexia",
    name: "Dyslexia Friendly",
    summary: "Increased spacing and a hyperlegible font for lower reading friction.",
    details: [
      "Lexend font",
      "Larger text",
      "Increased line height",
      "Increased letter spacing",
      "Reduced line length",
    ],
    settings: {
      font: "lexend",
      fontSize: 20,
      lineHeight: 1.9,
      letterSpacing: 0.05,
      wordSpacing: 0.16,
      paragraphSpacing: 1.6,
      columnWidth: "narrow",
      background: "warm",
      focusLines: 0,
    },
  },
  {
    id: "focus",
    name: "Focus Reading",
    summary: "A narrow reading window that dims everything but the active lines.",
    details: ["Shorter reading window", "Focus mode on", "Reduced distraction"],
    settings: {
      font: "atkinson",
      fontSize: 19,
      lineHeight: 1.85,
      letterSpacing: 0.03,
      wordSpacing: 0.08,
      paragraphSpacing: 1.5,
      columnWidth: "narrow",
      background: "warm",
      focusLines: 3,
      highlightParagraph: true,
    },
  },
  {
    id: "contrast",
    name: "High Contrast",
    summary: "Maximum separation between text and background for clarity.",
    details: ["High contrast", "Clear text / background separation"],
    settings: {
      font: "atkinson",
      fontSize: 19,
      lineHeight: 1.8,
      letterSpacing: 0.03,
      wordSpacing: 0.04,
      paragraphSpacing: 1.4,
      columnWidth: "wide",
      background: "dark",
      focusLines: 0,
    },
  },
  {
    id: "custom",
    name: "Custom",
    summary: "Start from sensible defaults and fine-tune every control yourself.",
    details: ["Full manual control", "Adjust in the reader"],
    settings: {},
  },
]
