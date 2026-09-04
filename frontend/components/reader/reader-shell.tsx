"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  PanelRightClose,
  PanelRightOpen,
  Pause,
  Play,
  RotateCcw,
  SlidersHorizontal,
  Square,
  ListTree,
} from "lucide-react"
import { useReading } from "@/components/reading-provider"
import { documentMeta, documentNodes } from "@/lib/document"
import { columnCh, surfaceStyle, textStyle } from "@/lib/reading-styles"
import { DocumentContent } from "@/components/reader/document-content"
import { ControlsPanel } from "@/components/reader/controls-panel"
import { ContentsPanel } from "@/components/reader/contents-panel"
import { LinkButton } from "@/components/ui"

type SidePanel = "controls" | "contents" | null

const readable = documentNodes.filter((n) =>
  ["heading", "paragraph", "keyconcept", "quote", "caption"].includes(n.type),
)

export function ReaderShell() {
  const { settings, ready } = useReading()
  const [panel, setPanel] = useState<SidePanel>("controls")
  const [activeId, setActiveId] = useState<string | null>(readable[0]?.id ?? null)

  const [speaking, setSpeaking] = useState(false)
  const [paused, setPaused] = useState(false)
  const [rulerY, setRulerY] = useState<number | null>(null)

  const nodeRefs = useRef<Map<string, HTMLElement>>(new Map())
  const canvasRef = useRef<HTMLDivElement>(null)

  const registerRef = useCallback((id: string, el: HTMLElement | null) => {
    if (el) nodeRefs.current.set(id, el)
    else nodeRefs.current.delete(id)
  }, [])

  const jumpTo = useCallback((id: string) => {
    setActiveId(id)
    const el = nodeRefs.current.get(id)
    el?.scrollIntoView({ behavior: "smooth", block: "center" })
  }, [])

  const stopSpeech = useCallback(() => {
    if (typeof window === "undefined") return
    window.speechSynthesis?.cancel()
    setSpeaking(false)
    setPaused(false)
  }, [])

  const speakFrom = useCallback(
    (startId: string | null) => {
      if (typeof window === "undefined" || !window.speechSynthesis) return
      window.speechSynthesis.cancel()

      const startIdx = Math.max(
        0,
        readable.findIndex((n) => n.id === startId),
      )
      const queue = readable.slice(startIdx)
      setSpeaking(true)
      setPaused(false)

      const speakNode = (i: number) => {
        if (i >= queue.length) {
          setSpeaking(false)
          return
        }
        const node = queue[i]
        setActiveId(node.id)
        nodeRefs.current
          .get(node.id)
          ?.scrollIntoView({ behavior: "smooth", block: "center" })
        const u = new SpeechSynthesisUtterance(node.content ?? "")
        u.rate = 0.98
        u.onend = () => speakNode(i + 1)
        u.onerror = () => setSpeaking(false)
        window.speechSynthesis.speak(u)
      }
      speakNode(0)
    },
    [],
  )

  const togglePlay = useCallback(() => {
    if (typeof window === "undefined") return
    const synth = window.speechSynthesis
    if (!synth) return
    if (!speaking) {
      speakFrom(activeId)
    } else if (paused) {
      synth.resume()
      setPaused(false)
    } else {
      synth.pause()
      setPaused(true)
    }
  }, [speaking, paused, activeId, speakFrom])

  useEffect(() => () => stopSpeech(), [stopSpeech])

  const onCanvasMove = useCallback(
    (e: React.MouseEvent) => {
      if (!settings.ruler) return
      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return
      setRulerY(e.clientY - rect.top)
    },
    [settings.ruler],
  )

  const maxWidth = useMemo(
    () => `${columnCh(settings.columnWidth)}ch`,
    [settings.columnWidth],
  )

  const focusActive = settings.focusLines > 0 || settings.highlightParagraph

  if (!ready) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <p className="micro-label text-ink-muted">Loading your settings…</p>
      </div>
    )
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      <div
        className="relative flex-1 overflow-y-auto"
        style={surfaceStyle(settings)}
        ref={canvasRef}
        onMouseMove={onCanvasMove}
        onMouseLeave={() => setRulerY(null)}
      >
        {settings.ruler && rulerY !== null && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 z-10"
            style={{
              top: rulerY - 16,
              height: 32,
              background: "color-mix(in srgb, currentColor 8%, transparent)",
              borderTop: "1px solid color-mix(in srgb, currentColor 35%, transparent)",
              borderBottom:
                "1px solid color-mix(in srgb, currentColor 35%, transparent)",
            }}
          />
        )}

        <article
          className="mx-auto w-full px-6 py-12 md:px-10 md:py-16"
          style={{ maxWidth, ...textStyle(settings) }}
        >
          <DocumentContent
            nodes={documentNodes}
            settings={settings}
            activeId={focusActive ? activeId : speaking ? activeId : null}
            onActivate={setActiveId}
            registerRef={registerRef}
          />

          <div
            className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t pt-6"
            style={{ borderColor: "color-mix(in srgb, currentColor 20%, transparent)" }}
          >
            <span className="text-[0.75em] uppercase tracking-[0.15em] opacity-60">
              End of chapter
            </span>
            <LinkButton href="/score" variant="secondary">
              View accessibility score
            </LinkButton>
          </div>
        </article>
      </div>

      {panel && (
        <aside className="hidden w-[320px] shrink-0 border-l border-dashed border-line bg-surface lg:block">
          {panel === "controls" ? (
            <ControlsPanel />
          ) : (
            <ContentsPanel activeId={activeId} onJump={jumpTo} />
          )}
        </aside>
      )}

      <div className="flex w-12 shrink-0 flex-col items-center gap-1 border-l border-dashed border-line bg-surface py-3">
        <RailButton
          label="Reading controls"
          active={panel === "controls"}
          onClick={() => setPanel((p) => (p === "controls" ? null : "controls"))}
        >
          <SlidersHorizontal className="h-4 w-4" />
        </RailButton>
        <RailButton
          label="Table of contents"
          active={panel === "contents"}
          onClick={() => setPanel((p) => (p === "contents" ? null : "contents"))}
        >
          <ListTree className="h-4 w-4" />
        </RailButton>

        <div className="my-1 h-px w-6 bg-line" />

        <RailButton
          label={speaking && !paused ? "Pause reading" : "Read aloud"}
          active={speaking}
          onClick={togglePlay}
        >
          {speaking && !paused ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </RailButton>
        <RailButton label="Stop reading" onClick={stopSpeech} disabled={!speaking}>
          <Square className="h-4 w-4" />
        </RailButton>
        <RailButton
          label="Restart from top"
          onClick={() => {
            jumpTo(readable[0].id)
            if (speaking) speakFrom(readable[0].id)
          }}
        >
          <RotateCcw className="h-4 w-4" />
        </RailButton>

        <div className="mt-auto hidden lg:flex">
          <RailButton
            label={panel ? "Collapse panel" : "Expand panel"}
            onClick={() => setPanel((p) => (p ? null : "controls"))}
          >
            {panel ? (
              <PanelRightClose className="h-4 w-4" />
            ) : (
              <PanelRightOpen className="h-4 w-4" />
            )}
          </RailButton>
        </div>
      </div>
    </div>
  )
}

function RailButton({
  children,
  label,
  active,
  disabled,
  onClick,
}: {
  children: React.ReactNode
  label: string
  active?: boolean
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={[
        "flex h-9 w-9 items-center justify-center border transition-colors disabled:opacity-30",
        active
          ? "border-ink bg-ink text-background"
          : "border-transparent text-ink-secondary hover:border-line hover:bg-surface-muted hover:text-ink",
      ].join(" ")}
    >
      {children}
    </button>
  )
}
