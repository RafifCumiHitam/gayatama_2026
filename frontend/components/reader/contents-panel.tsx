"use client"

import { documentNodes } from "@/lib/document"
import { MicroLabel } from "@/components/ui"

interface Props {
  activeId: string | null
  onJump: (id: string) => void
}

const headings = documentNodes.filter((n) => n.type === "heading")

export function ContentsPanel({ activeId, onJump }: Props) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-dashed border-line px-4 py-3">
        <MicroLabel>Contents</MicroLabel>
      </div>
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <ul className="flex flex-col">
          {headings.map((h) => {
            const isActive = activeId === h.id
            return (
              <li key={h.id}>
                <button
                  onClick={() => onJump(h.id)}
                  className={[
                    "flex w-full items-baseline gap-2 border-l-2 py-1.5 pr-2 text-left text-[13px] transition-colors",
                    h.level === 1 ? "pl-3 font-semibold" : "pl-6",
                    isActive
                      ? "border-ink bg-surface-muted text-ink"
                      : "border-transparent text-ink-secondary hover:text-ink",
                  ].join(" ")}
                >
                  <span className="line-clamp-2">{h.content}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="border-t border-dashed border-line px-4 py-3">
        <p className="caption text-ink-muted">
          {headings.length} sections · reconstructed structure
        </p>
      </div>
    </div>
  )
}
