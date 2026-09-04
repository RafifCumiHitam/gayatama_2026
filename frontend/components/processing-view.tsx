"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Check, FileText, Loader } from "lucide-react"
import { LinkButton, MicroLabel, Panel } from "@/components/ui"
import { documentMeta, documentStructure } from "@/lib/document"

const STAGES = [
  { key: "upload", label: "Receiving document", detail: "economic-growth.pdf" },
  { key: "extract", label: "Extracting text", detail: "3,480 words across 12 pages" },
  { key: "structure", label: "Detecting structure", detail: "Headings, lists, tables, figures" },
  { key: "reflow", label: "Reflowing layout", detail: "Rebuilding a single reading order" },
  { key: "analyze", label: "Analyzing accessibility", detail: "Scoring against WCAG heuristics" },
]

export function ProcessingView() {
  const router = useRouter()
  const [active, setActive] = useState(0)
  const [done, setDone] = useState(false)
  const [revealed, setRevealed] = useState(0)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    // Advance the pipeline stage by stage.
    STAGES.forEach((_, i) => {
      timers.current.push(
        setTimeout(() => setActive(i + 1), (i + 1) * 900),
      )
    })
    timers.current.push(
      setTimeout(() => setDone(true), STAGES.length * 900 + 400),
    )
    return () => timers.current.forEach(clearTimeout)
  }, [])

  // Once structure detection begins, reveal the tree progressively.
  useEffect(() => {
    if (active < 3) return
    let i = revealed
    const id = setInterval(() => {
      i += 1
      setRevealed(i)
      if (i >= documentStructure.length) clearInterval(id)
    }, 90)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active >= 3])

  return (
    <div className="grid grid-cols-1 gap-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      {/* Pipeline */}
      <section className="border-b border-dashed border-line py-8 lg:border-b-0 lg:border-r lg:py-12 lg:pr-12">
        <MicroLabel>{done ? "Ready" : "Processing"}</MicroLabel>
        <h1 className="mt-4 text-3xl font-bold leading-tight text-ink md:text-4xl">
          {done
            ? "Your document is ready."
            : "Rebuilding your document…"}
        </h1>
        <p className="mt-3 max-w-md text-pretty text-[15px] leading-relaxed text-ink-secondary">
          We are extracting the text, detecting the underlying structure, and
          reflowing everything into a single, accessible reading order.
        </p>

        <ol className="mt-10 border-t border-dashed border-line">
          {STAGES.map((stage, i) => {
            const state =
              i < active ? "done" : i === active && !done ? "active" : done ? "done" : "pending"
            return (
              <li
                key={stage.key}
                className="flex items-center gap-4 border-b border-dashed border-line py-4"
              >
                <span
                  className={[
                    "flex h-8 w-8 shrink-0 items-center justify-center border",
                    state === "done"
                      ? "border-ink bg-ink text-background"
                      : state === "active"
                        ? "border-ink text-ink"
                        : "border-dashed border-line text-ink-disabled",
                  ].join(" ")}
                  aria-hidden="true"
                >
                  {state === "done" ? (
                    <Check className="h-4 w-4" />
                  ) : state === "active" ? (
                    <Loader className="h-4 w-4 animate-spin" />
                  ) : (
                    <span className="font-mono text-[11px]">{i + 1}</span>
                  )}
                </span>
                <div className="min-w-0">
                  <p
                    className={[
                      "text-sm font-medium",
                      state === "pending" ? "text-ink-disabled" : "text-ink",
                    ].join(" ")}
                  >
                    {stage.label}
                  </p>
                  <p className="caption truncate text-ink-muted">{stage.detail}</p>
                </div>
                <span className="ml-auto shrink-0 caption text-ink-muted" aria-hidden>
                  {state === "done" ? "Done" : state === "active" ? "…" : ""}
                </span>
              </li>
            )
          })}
        </ol>

        <div className="mt-8 flex items-center gap-4" aria-live="polite">
          <LinkButton
            href="/profile"
            aria-disabled={!done}
            className={!done ? "pointer-events-none opacity-40" : ""}
          >
            Choose a reading profile <ArrowRight className="h-3.5 w-3.5" />
          </LinkButton>
          {!done && (
            <span className="caption text-ink-muted">
              Finishing analysis…
            </span>
          )}
        </div>
      </section>

      {/* Detected structure */}
      <section className="py-8 lg:py-12 lg:pl-12">
        <div className="flex items-center justify-between">
          <MicroLabel>Detected Structure</MicroLabel>
          <span className="caption text-ink-muted">
            {Math.min(revealed, documentStructure.length)} elements
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Meta label="Format" value={documentMeta.format} />
          <Meta label="Pages" value={String(documentMeta.pages)} />
          <Meta label="Words" value={documentMeta.words.toLocaleString()} />
        </div>

        <Panel className="mt-5 max-h-[520px] overflow-hidden p-0">
          <div className="flex items-center gap-2 border-b border-dashed border-line px-4 py-3">
            <FileText className="h-4 w-4 text-ink-secondary" strokeWidth={1.75} />
            <span className="text-[13px] font-medium text-ink">
              {documentMeta.title}
            </span>
          </div>
          <ul className="divide-y divide-dashed divide-line">
            {documentStructure.slice(0, revealed).map((item, i) => (
              <li
                key={i}
                className="flex items-center gap-3 px-4 py-2.5"
                style={{ paddingLeft: `${16 + item.indent * 20}px` }}
              >
                <span className="min-w-[42px] shrink-0 border border-dashed border-line px-1.5 py-0.5 text-center font-mono text-[10px] uppercase text-ink-muted">
                  {item.type}
                </span>
                <span className="truncate text-[13px] text-ink">
                  {item.label}
                </span>
                {item.count ? (
                  <span className="ml-auto shrink-0 caption text-ink-muted">
                    ×{item.count}
                  </span>
                ) : null}
              </li>
            ))}
            {revealed < documentStructure.length && (
              <li className="flex items-center gap-2 px-4 py-2.5 text-ink-muted">
                <Loader className="h-3.5 w-3.5 animate-spin" />
                <span className="caption">Detecting…</span>
              </li>
            )}
          </ul>
        </Panel>
      </section>
    </div>
  )
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-dashed border-line px-3 py-2">
      <p className="micro-label">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-ink">{value}</p>
    </div>
  )
}
