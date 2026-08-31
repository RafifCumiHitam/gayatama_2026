export type NodeType =
  | "heading"
  | "paragraph"
  | "list"
  | "image"
  | "table"
  | "quote"
  | "caption"
  | "keyconcept"
  | "footnote"

export interface DocumentNode {
  id: string
  type: NodeType
  content?: string
  level?: 1 | 2 | 3
  page: number
  order: number
  items?: string[]
  table?: { headers: string[]; rows: string[][] }
  alt?: string | null
  metadata?: Record<string, unknown>
}

export interface DocumentMeta {
  title: string
  filename: string
  format: string
  pages: number
  words: number
  originalScore: number
  accessibleScore: number
}

export const documentMeta: DocumentMeta = {
  title: "Economic Growth and Development",
  filename: "economic-growth.pdf",
  format: "PDF",
  pages: 12,
  words: 3480,
  originalScore: 54,
  accessibleScore: 82,
}

export const documentNodes: DocumentNode[] = [
  {
    id: "h-ch2",
    type: "heading",
    level: 1,
    content: "Chapter 2 — Economic Growth",
    page: 4,
    order: 0,
  },
  {
    id: "p-1",
    type: "paragraph",
    page: 4,
    order: 1,
    content:
      "Economic growth is the increase in the production of goods and services in an economy over a period of time. It is conventionally measured as the percent rate of increase in real gross domestic product, or real GDP. Growth is usually calculated in real terms, adjusted for inflation, to eliminate the distorting effect of rising prices on the value of what an economy produces.",
  },
  {
    id: "p-2",
    type: "paragraph",
    page: 4,
    order: 2,
    content:
      "Understanding growth matters because sustained increases in output per person are the primary way societies raise living standards over the long run. Even small differences in annual growth rates compound into large differences in prosperity across decades, which is why economists study the factors that drive and sustain growth so closely.",
  },
  {
    id: "h-21",
    type: "heading",
    level: 2,
    content: "2.1 Introduction",
    page: 4,
    order: 3,
  },
  {
    id: "p-3",
    type: "paragraph",
    page: 4,
    order: 4,
    content:
      "This section introduces the core vocabulary of growth economics. We distinguish between growth in total output and growth in output per capita, and we explain why the latter is the more meaningful measure of improvement in average welfare.",
  },
  {
    id: "kc-1",
    type: "keyconcept",
    page: 5,
    order: 5,
    content:
      "Real GDP measures the value of all final goods and services produced within a country in a given period, adjusted for inflation. Growth in real GDP per capita is the standard proxy for rising living standards.",
  },
  {
    id: "p-4",
    type: "paragraph",
    page: 5,
    order: 6,
    content:
      "It is important to note that GDP is an imperfect measure. It excludes unpaid work, does not account for the distribution of income, and says nothing directly about environmental sustainability or well-being. These limitations are the subject of ongoing debate among economists.",
  },
  {
    id: "h-22",
    type: "heading",
    level: 2,
    content: "2.2 Factors Affecting Growth",
    page: 6,
    order: 7,
  },
  {
    id: "p-5",
    type: "paragraph",
    page: 6,
    order: 8,
    content:
      "Several interrelated factors determine how quickly an economy can grow. The most frequently cited drivers fall into a small number of broad categories, each of which can be strengthened through policy, investment, and institutional reform.",
  },
  {
    id: "list-1",
    type: "list",
    page: 6,
    order: 9,
    items: [
      "Capital accumulation — investment in machinery, infrastructure, and buildings.",
      "Technological progress — new methods that raise output from the same inputs.",
      "Labour force growth — more workers, and workers with better skills.",
      "Human capital — education, training, and health that raise productivity.",
      "Institutions — stable rules, property rights, and functioning markets.",
    ],
  },
  {
    id: "img-1",
    type: "image",
    page: 7,
    order: 10,
    alt: null,
    content: "GDP Growth by Region, 2020–2025",
  },
  {
    id: "cap-1",
    type: "caption",
    page: 7,
    order: 11,
    content: "Figure 2.1 — GDP growth by region, 2020–2025. Source: World Bank.",
  },
  {
    id: "p-6",
    type: "paragraph",
    page: 7,
    order: 12,
    content:
      "As Figure 2.1 shows, growth rates vary widely across regions and over time. Emerging economies frequently post higher headline growth than advanced economies, in part because they begin from a lower base and can adopt existing technologies rather than inventing new ones.",
  },
  {
    id: "h-23",
    type: "heading",
    level: 2,
    content: "2.3 Measuring Growth",
    page: 8,
    order: 13,
  },
  {
    id: "p-7",
    type: "paragraph",
    page: 8,
    order: 14,
    content:
      "The table below compares three common measures used when discussing growth. Each answers a slightly different question, and using the wrong measure can lead to misleading conclusions about how well an economy is performing.",
  },
  {
    id: "tbl-1",
    type: "table",
    page: 8,
    order: 15,
    table: {
      headers: ["Measure", "What it captures", "Best used for"],
      rows: [
        ["Real GDP", "Total output, inflation-adjusted", "Overall economic size"],
        ["GDP per capita", "Output per person", "Average living standards"],
        ["GDP growth rate", "Percent change over time", "Momentum and cycles"],
      ],
    },
  },
  {
    id: "q-1",
    type: "quote",
    page: 9,
    order: 16,
    content:
      "Compound growth is the most powerful force in economics: a country growing at 2% per year doubles its output roughly every 35 years.",
  },
  {
    id: "p-8",
    type: "paragraph",
    page: 9,
    order: 17,
    content:
      "This compounding effect explains why long-run growth is such a central policy concern. Policies that raise the sustainable growth rate by even a fraction of a percentage point can, over a generation, transform the material conditions of an entire population.",
  },
  {
    id: "h-24",
    type: "heading",
    level: 2,
    content: "2.4 Summary",
    page: 11,
    order: 18,
  },
  {
    id: "p-9",
    type: "paragraph",
    page: 11,
    order: 19,
    content:
      "Economic growth expands the total output of an economy and, when it outpaces population growth, raises average living standards. It is driven by capital, technology, labour, human capital, and institutions, and it is best understood through several complementary measures rather than any single number.",
  },
  {
    id: "fn-1",
    type: "footnote",
    page: 11,
    order: 20,
    content:
      "1. Real values are adjusted for inflation using a price deflator, allowing comparison across different years.",
  },
]

export interface StructureItem {
  label: string
  type: string
  indent: number
  count?: number
}

/** Derived structure tree shown on the Processing screen. */
export const documentStructure: StructureItem[] = [
  { label: "Chapter 2 — Economic Growth", type: "H1", indent: 0 },
  { label: "Introduction paragraphs", type: "P", indent: 1, count: 2 },
  { label: "2.1 Introduction", type: "H2", indent: 1 },
  { label: "Paragraphs", type: "P", indent: 2, count: 1 },
  { label: "Real GDP", type: "KEY", indent: 2 },
  { label: "Paragraphs", type: "P", indent: 2, count: 1 },
  { label: "2.2 Factors Affecting Growth", type: "H2", indent: 1 },
  { label: "Paragraphs", type: "P", indent: 2, count: 1 },
  { label: "Growth factors", type: "LIST", indent: 2 },
  { label: "GDP Growth by Region", type: "IMG", indent: 2 },
  { label: "Figure 2.1 caption", type: "CAP", indent: 2 },
  { label: "2.3 Measuring Growth", type: "H2", indent: 1 },
  { label: "Comparison of measures", type: "TBL", indent: 2 },
  { label: "Compound growth", type: "QUOTE", indent: 2 },
  { label: "2.4 Summary", type: "H2", indent: 1 },
  { label: "Footnote", type: "FN", indent: 1 },
]
