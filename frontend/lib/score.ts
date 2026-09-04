export type CheckStatus = "pass" | "fixed" | "warn" | "fail"

export interface AccessibilityCheck {
  id: string
  label: string
  wcag: string
  detail: string
  before: CheckStatus
  after: CheckStatus
}

export interface ScoreCategory {
  id: string
  name: string
  before: number
  after: number
  checks: AccessibilityCheck[]
}

export const scoreCategories: ScoreCategory[] = [
  {
    id: "structure",
    name: "Document Structure",
    before: 42,
    after: 96,
    checks: [
      {
        id: "headings",
        label: "Heading hierarchy",
        wcag: "1.3.1",
        detail:
          "Reconstructed a logical H1–H3 outline from visual styling so screen readers can navigate by section.",
        before: "fail",
        after: "fixed",
      },
      {
        id: "reading-order",
        label: "Logical reading order",
        wcag: "1.3.2",
        detail:
          "Re-sequenced multi-column and floating content into a single linear reading flow.",
        before: "warn",
        after: "fixed",
      },
      {
        id: "lists",
        label: "Lists marked up semantically",
        wcag: "1.3.1",
        detail: "Detected bullet groups and encoded them as true list elements.",
        before: "fail",
        after: "fixed",
      },
    ],
  },
  {
    id: "text",
    name: "Text & Language",
    before: 68,
    after: 94,
    checks: [
      {
        id: "selectable",
        label: "Selectable, real text",
        wcag: "1.4.5",
        detail:
          "Extracted machine-readable text so content is no longer locked inside a page image.",
        before: "warn",
        after: "pass",
      },
      {
        id: "lang",
        label: "Document language set",
        wcag: "3.1.1",
        detail: "Detected primary language and tagged the document as English.",
        before: "fail",
        after: "fixed",
      },
      {
        id: "resize",
        label: "Text resizes without loss",
        wcag: "1.4.4",
        detail:
          "Content reflows to any text size and reading width without clipping or overlap.",
        before: "fail",
        after: "fixed",
      },
    ],
  },
  {
    id: "media",
    name: "Images & Tables",
    before: 30,
    after: 78,
    checks: [
      {
        id: "alt",
        label: "Alt text for images",
        wcag: "1.1.1",
        detail:
          "Generated descriptive alt text for the regional GDP chart; one decorative rule was marked as such.",
        before: "fail",
        after: "fixed",
      },
      {
        id: "table-headers",
        label: "Table headers associated",
        wcag: "1.3.1",
        detail:
          "Identified the header row of the comparison table and associated it with data cells.",
        before: "warn",
        after: "fixed",
      },
      {
        id: "complex-fig",
        label: "Complex figure long description",
        wcag: "1.1.1",
        detail:
          "The chart could benefit from a longer data description — flagged for manual review.",
        before: "fail",
        after: "warn",
      },
    ],
  },
  {
    id: "reading",
    name: "Reading Experience",
    before: 80,
    after: 100,
    checks: [
      {
        id: "contrast",
        label: "Contrast is adjustable",
        wcag: "1.4.3",
        detail:
          "Reader offers high-contrast and tinted backgrounds meeting AA contrast ratios.",
        before: "warn",
        after: "pass",
      },
      {
        id: "spacing",
        label: "Text spacing adjustable",
        wcag: "1.4.12",
        detail:
          "Line, letter, word, and paragraph spacing are all user-controllable.",
        before: "pass",
        after: "pass",
      },
      {
        id: "tts",
        label: "Read-aloud available",
        wcag: "—",
        detail: "Built-in text-to-speech reads content in logical order.",
        before: "fail",
        after: "pass",
      },
    ],
  },
]

export function overallScore(pick: "before" | "after") {
  const total = scoreCategories.reduce((sum, c) => sum + c[pick], 0)
  return Math.round(total / scoreCategories.length)
}

export const statusMeta: Record<
  CheckStatus,
  { label: string; tone: string; symbol: string }
> = {
  pass: { label: "Pass", tone: "text-status-pass", symbol: "✓" },
  fixed: { label: "Fixed", tone: "text-status-fixed", symbol: "✓" },
  warn: { label: "Review", tone: "text-status-warn", symbol: "!" },
  fail: { label: "Fail", tone: "text-status-fail", symbol: "✕" },
}
