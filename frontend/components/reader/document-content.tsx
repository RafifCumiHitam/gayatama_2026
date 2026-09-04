"use client"

import { Sparkles } from "lucide-react"
import type { DocumentNode } from "@/lib/document"
import type { ReadingSettings } from "@/lib/profiles"

interface Props {
  nodes: DocumentNode[]
  settings: ReadingSettings
  activeId: string | null
  onActivate?: (id: string) => void
  registerRef?: (id: string, el: HTMLElement | null) => void
}

const CHART = [
  { region: "N. America", value: 62 },
  { region: "Europe", value: 48 },
  { region: "Asia", value: 88 },
  { region: "Africa", value: 71 },
  { region: "S. America", value: 55 },
]

export function DocumentContent({
  nodes,
  settings,
  activeId,
  onActivate,
  registerRef,
}: Props) {
  const gap = `${settings.paragraphSpacing}em`

  return (
    <div className="flex flex-col" style={{ gap }}>
      {nodes.map((node) => {
        if (node.type === "footnote" && settings.hideFootnotes) return null

        const isActive = activeId === node.id
        const commonRef = (el: HTMLElement | null) => registerRef?.(node.id, el)
        const activeClass = isActive
          ? "bg-[color:currentColor]/[0.06] -mx-3 px-3"
          : ""

        switch (node.type) {
          case "heading": {
            const size =
              node.level === 1
                ? "text-[1.7em] font-bold"
                : node.level === 2
                  ? "text-[1.3em] font-semibold"
                  : "text-[1.1em] font-semibold"
            const Tag = (`h${node.level ?? 2}`) as "h1" | "h2" | "h3"
            return (
              <Tag
                key={node.id}
                ref={commonRef as never}
                id={`node-${node.id}`}
                className={`${size} scroll-mt-24 leading-tight ${activeClass}`}
                style={{ marginTop: node.level === 1 ? 0 : "0.4em" }}
              >
                {node.content}
              </Tag>
            )
          }

          case "paragraph":
            return (
              <p
                key={node.id}
                ref={commonRef}
                id={`node-${node.id}`}
                onClick={() => onActivate?.(node.id)}
                className={`transition-colors ${onActivate ? "cursor-pointer" : ""} ${activeClass}`}
              >
                {node.content}
              </p>
            )

          case "keyconcept":
            return (
              <aside
                key={node.id}
                ref={commonRef as never}
                id={`node-${node.id}`}
                className={`border-l-2 border-current/40 py-1 pl-4 ${activeClass}`}
              >
                <span className="mb-1 block text-[0.7em] font-semibold uppercase tracking-[0.15em] opacity-60">
                  Key concept
                </span>
                <span className="italic">{node.content}</span>
              </aside>
            )

          case "list":
            return (
              <ul
                key={node.id}
                ref={commonRef as never}
                id={`node-${node.id}`}
                className={`flex list-none flex-col ${activeClass}`}
                style={{ gap: "0.5em" }}
              >
                {node.items?.map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span
                      aria-hidden
                      className="mt-[0.55em] h-[3px] w-[3px] shrink-0 bg-current opacity-70"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )

          case "image":
            return (
              <figure
                key={node.id}
                ref={commonRef as never}
                id={`node-${node.id}`}
                className={activeClass}
              >
                <div className="border border-current/20 p-5">
                  <p className="mb-4 text-[0.75em] font-semibold uppercase tracking-[0.12em] opacity-70">
                    {node.content}
                  </p>
                  <div
                    className="flex items-end gap-3"
                    style={{ height: "8em" }}
                    role="img"
                    aria-label="GDP growth by region bar chart: Asia highest, Africa and North America mid, South America and Europe lower."
                  >
                    {CHART.map((bar) => (
                      <div
                        key={bar.region}
                        className="flex flex-1 flex-col items-center gap-2"
                      >
                        <div
                          className="w-full bg-current opacity-80"
                          style={{ height: `${bar.value}%` }}
                        />
                        <span className="text-[0.6em] uppercase tracking-wide opacity-60">
                          {bar.region}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <span className="mt-2 inline-flex items-center gap-1.5 text-[0.7em] uppercase tracking-[0.12em] opacity-70">
                  <Sparkles className="h-3 w-3" /> Alt text added
                </span>
              </figure>
            )

          case "caption":
            return (
              <p
                key={node.id}
                ref={commonRef}
                id={`node-${node.id}`}
                className={`text-[0.8em] opacity-70 ${activeClass}`}
              >
                {node.content}
              </p>
            )

          case "table":
            return (
              <figure
                key={node.id}
                ref={commonRef as never}
                id={`node-${node.id}`}
                className={`overflow-x-auto ${activeClass}`}
              >
                <table className="w-full border-collapse text-[0.85em]">
                  <thead>
                    <tr>
                      {node.table?.headers.map((h) => (
                        <th
                          key={h}
                          className="border border-current/20 px-3 py-2 text-left font-semibold"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {node.table?.rows.map((row, i) => (
                      <tr key={i}>
                        {row.map((cell, j) => (
                          <td
                            key={j}
                            className="border border-current/20 px-3 py-2"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </figure>
            )

          case "quote":
            return (
              <blockquote
                key={node.id}
                ref={commonRef as never}
                id={`node-${node.id}`}
                className={`border-l-2 border-current/40 pl-4 text-[1.05em] italic ${activeClass}`}
              >
                {node.content}
              </blockquote>
            )

          case "footnote":
            return (
              <p
                key={node.id}
                ref={commonRef}
                id={`node-${node.id}`}
                className={`border-t border-current/15 pt-3 text-[0.8em] opacity-70 ${activeClass}`}
              >
                {node.content}
              </p>
            )

          default:
            return null
        }
      })}
    </div>
  )
}
