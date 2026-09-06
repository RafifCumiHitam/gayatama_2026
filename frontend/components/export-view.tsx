"use client"

import { useState } from "react"
import {
  ArrowRight,
  Check,
  Download,
  FileText,
  Loader,
} from "lucide-react"
import { Button, LinkButton, MicroLabel, Panel } from "@/components/ui"
import { documentMeta } from "@/lib/document"
import { overallScore } from "@/lib/score"

type FormatId = "pdf" | "html" | "epub" | "docx"
type ExportState = "ready" | "generating" | "complete" | "failed"

interface FormatOption {
  id: FormatId
  label: string
  title: string
  description: string
  filename: string
  mvp: boolean
}

const FORMATS: FormatOption[] = [
  {
    id: "pdf",
    label: "PDF",
    title: "Accessible PDF",
    description:
      "Tagged single-column PDF with reading order, headings, and alt text preserved.",
    filename: "economic-growth-accessible.pdf",
    mvp: true,
  },
  {
    id: "html",
    label: "HTML",
    title: "Readable HTML",
    description:
      "Self-contained HTML page with semantic markup and your reading profile applied.",
    filename: "economic-growth-accessible.html",
    mvp: true,
  },
  {
    id: "epub",
    label: "EPUB",
    title: "EPUB ebook",
    description:
      "Reflowable EPUB for e-readers and reading apps. Available in a later release.",
    filename: "economic-growth-accessible.epub",
    mvp: false,
  },
  {
    id: "docx",
    label: "DOCX",
    title: "Word document",
    description:
      "Editable DOCX with styles mapped from the semantic structure. Coming soon.",
    filename: "economic-growth-accessible.docx",
    mvp: false,
  },
]

function BeforeAfterCard() {
  const before = overallScore("before")
  const after = overallScore("after")

  return (
    <div className="grid grid-cols-1 gap-0 sm:grid-cols-[1fr_auto_1fr]">
      <Panel className="p-5">
        <MicroLabel>Original</MicroLabel>
        <p className="mt-3 truncate text-sm font-medium text-ink">
          {documentMeta.filename}
        </p>
        <p className="caption mt-1 text-ink-muted">
          {documentMeta.format} · {documentMeta.pages} pages
        </p>
        <div className="mt-4 flex items-end gap-2">
          <span className="text-3xl font-bold leading-none text-ink">{before}</span>
          <span className="pb-0.5 text-[12px] text-ink-muted">/ 100</span>
        </div>
      </Panel>

      <div className="flex items-center justify-center px-3 py-4 sm:py-0">
        <span
          className="font-mono text-[13px] text-ink-muted"
          aria-hidden
        >
          →
        </span>
      </div>

      <Panel className="border-success/40 p-5">
        <MicroLabel>Accessible version</MicroLabel>
        <p className="mt-3 truncate text-sm font-medium text-ink">
          {documentMeta.title}
        </p>
        <p className="caption mt-1 text-ink-muted">
          Single-column · reflowed · profile-ready
        </p>
        <div className="mt-4 flex items-end gap-2">
          <span className="text-3xl font-bold leading-none text-success">
            {after}
          </span>
          <span className="pb-0.5 text-[12px] text-ink-muted">/ 100</span>
          <span className="ml-auto pb-0.5 font-mono text-[12px] text-success">
            +{after - before}
          </span>
        </div>
      </Panel>
    </div>
  )
}

export function ExportView() {
  const [states, setStates] = useState<Record<FormatId, ExportState>>({
    pdf: "ready",
    html: "ready",
    epub: "ready",
    docx: "ready",
  })

  const handleExport = (id: FormatId) => {
    const format = FORMATS.find((f) => f.id === id)
    if (!format?.mvp) return

    setStates((s) => ({ ...s, [id]: "generating" }))

    // Deterministic mock: simulate generation then complete.
    window.setTimeout(() => {
      setStates((s) => ({ ...s, [id]: "complete" }))
      // Trigger a soft download of a tiny placeholder blob so the control feels real.
      const blob = new Blob(
        [
          `ReadAble accessible export\n` +
            `Document: ${documentMeta.title}\n` +
            `Format: ${format.label}\n` +
            `Generated: ${new Date().toISOString()}\n`,
        ],
        { type: "text/plain" },
      )
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = format.filename
      a.click()
      URL.revokeObjectURL(url)
    }, 1400)
  }

  return (
    <div className="mx-auto max-w-3xl py-8 md:py-12">
      <MicroLabel>Step 06 — Export</MicroLabel>
      <h1 className="mt-4 text-3xl font-bold leading-tight text-ink md:text-4xl">
        Your document is ready.
      </h1>
      <p className="mt-3 max-w-lg text-pretty text-[15px] leading-relaxed text-ink-secondary">
        Choose a format to download, or keep reading in the browser with your
        profile applied.
      </p>

      <div className="mt-8">
        <BeforeAfterCard />
      </div>

      <div className="mt-10">
        <MicroLabel>Export formats</MicroLabel>
        <ul className="mt-4 divide-y divide-dashed divide-line border-y border-dashed border-line">
          {FORMATS.map((fmt) => {
            const state = states[fmt.id]
            const disabled = !fmt.mvp || state === "generating"

            return (
              <li
                key={fmt.id}
                className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <FileText
                      className="h-4 w-4 shrink-0 text-ink-secondary"
                      strokeWidth={1.75}
                    />
                    <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
                      {fmt.label}
                    </span>
                    {!fmt.mvp && (
                      <span className="border border-dashed border-line px-1.5 py-0.5 text-[10px] uppercase tracking-[0.1em] text-ink-muted">
                        Soon
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 text-sm font-medium text-ink">{fmt.title}</p>
                  <p className="mt-1 max-w-md text-[13px] leading-relaxed text-ink-secondary">
                    {fmt.description}
                  </p>
                  {fmt.mvp && (
                    <p className="caption mt-1.5 font-mono text-ink-muted">
                      {fmt.filename}
                    </p>
                  )}
                </div>

                <div className="shrink-0">
                  {state === "complete" ? (
                    <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-success">
                      <Check className="h-3.5 w-3.5" strokeWidth={2} />
                      Downloaded
                    </span>
                  ) : (
                    <Button
                      variant={fmt.mvp ? "primary" : "secondary"}
                      disabled={disabled}
                      onClick={() => handleExport(fmt.id)}
                      aria-busy={state === "generating"}
                    >
                      {state === "generating" ? (
                        <>
                          <Loader
                            className="h-3.5 w-3.5 animate-spin"
                            strokeWidth={2}
                          />
                          Preparing…
                        </>
                      ) : (
                        <>
                          <Download className="h-3.5 w-3.5" strokeWidth={2} />
                          {fmt.mvp ? "Export" : "Unavailable"}
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <LinkButton href="/reader" variant="secondary">
          Keep reading
        </LinkButton>
        <LinkButton href="/">
          Convert another document
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
        </LinkButton>
      </div>
    </div>
  )
}
