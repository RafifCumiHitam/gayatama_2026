"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, ArrowUp, Check, FileText, X } from "lucide-react"
import { Button, Chip } from "@/components/ui"

const FORMATS = ["PDF", "DOCX", "PPTX", "EPUB", "JPG", "PNG", "TXT"]
const ACCEPTED = [".pdf", ".docx", ".pptx", ".epub", ".jpg", ".jpeg", ".png", ".txt"]

type State = "idle" | "drag" | "uploading" | "success" | "error"

function isAccepted(name: string) {
  const lower = name.toLowerCase()
  return ACCEPTED.some((ext) => lower.endsWith(ext))
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export function UploadZone() {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [state, setState] = useState<State>("idle")
  const [progress, setProgress] = useState(0)
  const [file, setFile] = useState<{ name: string; size: number } | null>(null)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  function clearTimers() {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  function beginUpload(name: string, size: number) {
    clearTimers()
    setFile({ name, size })
    setState("uploading")
    setProgress(0)
    let pct = 0
    const tick = () => {
      pct += 12 + Math.random() * 16
      if (pct >= 100) {
        setProgress(100)
        setState("success")
        timers.current.push(setTimeout(() => router.push("/processing"), 900))
        return
      }
      setProgress(Math.round(pct))
      timers.current.push(setTimeout(tick, 220))
    }
    timers.current.push(setTimeout(tick, 240))
  }

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    const f = files[0]
    if (!isAccepted(f.name)) {
      setState("error")
      setFile({ name: f.name, size: f.size })
      return
    }
    beginUpload(f.name, f.size)
  }

  function cancel() {
    clearTimers()
    setState("idle")
    setProgress(0)
    setFile(null)
  }

  function useSample() {
    beginUpload("economic-growth.pdf", 1_842_000)
  }

  const isBusy = state === "uploading" || state === "success"

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(",")}
        className="sr-only"
        aria-label="Upload a document"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <div
        role="button"
        tabIndex={0}
        aria-label="Drag and drop your document here, or press Enter to browse"
        aria-disabled={isBusy}
        onClick={() => !isBusy && inputRef.current?.click()}
        onKeyDown={(e) => {
          if (isBusy) return
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            inputRef.current?.click()
          }
        }}
        onDragOver={(e) => {
          e.preventDefault()
          if (!isBusy) setState("drag")
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          if (!isBusy) setState("idle")
        }}
        onDrop={(e) => {
          e.preventDefault()
          if (isBusy) return
          handleFiles(e.dataTransfer.files)
        }}
        className={[
          "flex min-h-[320px] cursor-pointer flex-col items-center justify-center border p-8 text-center transition-colors",
          state === "drag"
            ? "border-solid border-ink bg-surface-subtle"
            : "border-dashed border-line hover:border-ink hover:bg-surface-muted",
          isBusy ? "cursor-default border-solid border-ink bg-surface" : "",
        ].join(" ")}
      >
        {(state === "idle" || state === "drag") && (
          <>
            <span className="mb-6 flex h-12 w-12 items-center justify-center border border-dashed border-line">
              <ArrowUp className="h-5 w-5 text-ink-secondary" strokeWidth={1.75} />
            </span>
            <p className="text-lg font-medium text-ink">
              Drag &amp; drop your document
            </p>
            <p className="mt-1 text-[13px] text-ink-secondary">or click to browse</p>

            <div className="mt-8 flex w-full items-center gap-3">
              <span className="h-px flex-1 bg-line-light" />
              <span className="micro-label">Supports</span>
              <span className="h-px flex-1 bg-line-light" />
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {FORMATS.map((f) => (
                <Chip key={f}>{f}</Chip>
              ))}
            </div>
          </>
        )}

        {(state === "uploading" || state === "success") && file && (
          <div className="w-full max-w-sm text-left">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-ink-secondary" strokeWidth={1.75} />
                <div>
                  <p className="text-sm font-medium text-ink">{file.name}</p>
                  <p className="caption text-ink-muted">{formatSize(file.size)}</p>
                </div>
              </div>
              {state === "uploading" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    cancel()
                  }}
                  className="flex items-center gap-1 text-[11px] uppercase tracking-[0.15em] text-ink-muted hover:text-ink"
                  aria-label="Cancel upload"
                >
                  <X className="h-3.5 w-3.5" /> Cancel
                </button>
              )}
            </div>

            <div className="mt-5 h-2 w-full bg-surface-muted" aria-hidden="true">
              <div
                className="h-full bg-ink transition-[width] duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div
              className="mt-2 flex items-center justify-between"
              aria-live="polite"
            >
              {state === "uploading" ? (
                <p className="caption text-ink-secondary">
                  Uploading… {progress}%
                </p>
              ) : (
                <p className="flex items-center gap-1.5 text-[13px] font-medium text-success">
                  <Check className="h-4 w-4" /> Document uploaded
                </p>
              )}
            </div>
          </div>
        )}

        {state === "error" && file && (
          <div className="w-full max-w-sm" aria-live="assertive">
            <span className="mx-auto mb-5 flex h-12 w-12 items-center justify-center border border-dashed border-error">
              <X className="h-5 w-5 text-error" strokeWidth={1.75} />
            </span>
            <p className="text-base font-medium text-error">
              Unable to process this file.
            </p>
            <p className="caption mx-auto mt-2 max-w-xs text-ink-secondary">
              {`"${file.name}" is not a supported format. Try a PDF, DOCX, PPTX, EPUB, image, or TXT file.`}
            </p>
            <Button
              variant="secondary"
              className="mt-5"
              onClick={(e) => {
                e.stopPropagation()
                cancel()
              }}
            >
              Try another file
            </Button>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <Button
          onClick={() => (isBusy ? undefined : inputRef.current?.click())}
          disabled={isBusy}
        >
          Upload document <ArrowRight className="h-3.5 w-3.5" />
        </Button>
        <button
          onClick={useSample}
          disabled={isBusy}
          className="text-[13px] text-ink-secondary underline decoration-dashed underline-offset-4 transition-colors hover:text-ink disabled:opacity-50"
        >
          or try a sample document
        </button>
      </div>
    </div>
  )
}
