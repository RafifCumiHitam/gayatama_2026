"use client"

import { ArrowRight, ExternalLink } from "lucide-react"
import { LinkButton, MicroLabel, Panel } from "@/components/ui"
import { documentMeta } from "@/lib/document"
import {
  overallScore,
  scoreCategories,
  statusMeta,
  type CheckStatus,
} from "@/lib/score"

const PAGE_SCORES = [
  { page: 4, score: 92 },
  { page: 5, score: 88 },
  { page: 6, score: 85 },
  { page: 7, score: 79 },
  { page: 8, score: 72 },
  { page: 9, score: 90 },
  { page: 10, score: 86 },
  { page: 11, score: 81 },
  { page: 12, score: 68 },
]

function StatusBadge({ status }: { status: CheckStatus }) {
  const meta = statusMeta[status]
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] ${meta.tone}`}
      aria-label={meta.label}
    >
      <span aria-hidden>{meta.symbol}</span>
      {meta.label}
    </span>
  )
}

function ScoreBar({ value, max = 100 }: { value: number; max?: number }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  return (
    <div
      className="h-1.5 w-full bg-surface-subtle"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div
        className="h-full bg-ink transition-[width] duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

export function ScoreView() {
  const before = overallScore("before")
  const after = overallScore("after")
  const delta = after - before

  const issueCount = scoreCategories.reduce(
    (n, cat) =>
      n + cat.checks.filter((c) => c.after === "warn" || c.after === "fail").length,
    0,
  )
  const fixedCount = scoreCategories.reduce(
    (n, cat) => n + cat.checks.filter((c) => c.after === "fixed").length,
    0,
  )

  return (
    <div className="grid grid-cols-1 gap-0 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)_minmax(0,240px)]">
      {/* Left: overall score */}
      <section className="border-b border-dashed border-line py-8 lg:border-b-0 lg:border-r lg:py-12 lg:pr-8">
        <MicroLabel>Step 05 — Accessibility Score</MicroLabel>
        <h1 className="mt-4 text-3xl font-bold leading-tight text-ink md:text-4xl">
          Before & after
        </h1>
        <p className="mt-3 text-pretty text-[15px] leading-relaxed text-ink-secondary">
          How {documentMeta.filename} scored against structure, text, media, and
          reading heuristics.
        </p>

        <Panel className="mt-8 p-5">
          <MicroLabel>Original</MicroLabel>
          <div className="mt-2 flex items-end gap-2">
            <span className="text-5xl font-bold leading-none text-ink">{before}</span>
            <span className="pb-1 text-sm text-ink-muted">/ 100</span>
          </div>
          <div className="mt-4 h-px w-full bg-line-light" />
          <MicroLabel className="mt-4">Accessible version</MicroLabel>
          <div className="mt-2 flex items-end gap-2">
            <span className="text-5xl font-bold leading-none text-success">{after}</span>
            <span className="pb-1 text-sm text-ink-muted">/ 100</span>
            <span className="ml-auto pb-1 font-mono text-[13px] text-success">
              +{delta}
            </span>
          </div>
        </Panel>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Panel className="p-4">
            <p className="font-mono text-2xl font-bold text-ink">{fixedCount}</p>
            <p className="caption mt-1 text-ink-muted">Issues fixed</p>
          </Panel>
          <Panel className="p-4">
            <p className="font-mono text-2xl font-bold text-ink">{issueCount}</p>
            <p className="caption mt-1 text-ink-muted">Need review</p>
          </Panel>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <LinkButton href="/export" className="w-full">
            Continue to export
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
          </LinkButton>
          <LinkButton href="/reader" variant="secondary" className="w-full">
            Back to reader
          </LinkButton>
        </div>
      </section>

      {/* Center: category checklist */}
      <section className="border-b border-dashed border-line py-8 lg:border-b-0 lg:border-r lg:px-8 lg:py-12">
        <MicroLabel>Checks by category</MicroLabel>
        <div className="mt-5 space-y-8">
          {scoreCategories.map((cat) => (
            <div key={cat.id}>
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-sm font-semibold text-ink">{cat.name}</h2>
                <div className="flex items-center gap-3 font-mono text-[12px]">
                  <span className="text-ink-muted">{cat.before}</span>
                  <span className="text-ink-disabled" aria-hidden>
                    →
                  </span>
                  <span className="font-semibold text-success">{cat.after}</span>
                </div>
              </div>
              <div className="mt-2">
                <ScoreBar value={cat.after} />
              </div>
              <ul className="mt-4 divide-y divide-dashed divide-line border-y border-dashed border-line">
                {cat.checks.map((check) => (
                  <li key={check.id} className="py-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-medium text-ink">
                          {check.label}
                        </p>
                        <p className="caption mt-0.5 text-ink-muted">
                          WCAG {check.wcag}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge status={check.before} />
                        <span className="text-ink-disabled" aria-hidden>
                          →
                        </span>
                        <StatusBadge status={check.after} />
                      </div>
                    </div>
                    <p className="mt-2 text-[13px] leading-relaxed text-ink-secondary">
                      {check.detail}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Right: page scores */}
      <aside className="py-8 lg:py-12 lg:pl-8">
        <MicroLabel>Page scores</MicroLabel>
        <p className="mt-2 text-[13px] text-ink-secondary">
          Approximate accessibility after reflow, by source page.
        </p>
        <ol className="mt-5 space-y-3">
          {PAGE_SCORES.map(({ page, score }) => (
            <li key={page} className="flex items-center gap-3">
              <span className="w-8 shrink-0 font-mono text-[12px] text-ink-muted">
                Pg {String(page).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <ScoreBar value={score} />
              </div>
              <span className="w-7 shrink-0 text-right font-mono text-[12px] text-ink">
                {score}
              </span>
            </li>
          ))}
        </ol>

        <Panel className="mt-8 p-4">
          <MicroLabel>Document</MicroLabel>
          <p className="mt-2 text-sm font-medium text-ink">{documentMeta.title}</p>
          <p className="caption mt-1 text-ink-muted">
            {documentMeta.format} · {documentMeta.pages} pages ·{" "}
            {documentMeta.words.toLocaleString()} words
          </p>
          <LinkButton
            href="/reader"
            variant="ghost"
            className="mt-3 w-full !justify-start !px-0"
          >
            <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.75} />
            Open in reader
          </LinkButton>
        </Panel>
      </aside>
    </div>
  )
}
