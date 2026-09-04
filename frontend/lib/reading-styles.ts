import type { CSSProperties } from "react"
import {
  BACKGROUNDS,
  COLUMNS,
  FONTS,
  type ReadingSettings,
} from "@/lib/profiles"

export function fontStack(key: ReadingSettings["font"]) {
  return FONTS.find((f) => f.key === key)?.stack ?? FONTS[0].stack
}

export function background(key: ReadingSettings["background"]) {
  return BACKGROUNDS.find((b) => b.key === key) ?? BACKGROUNDS[0]
}

export function columnCh(key: ReadingSettings["columnWidth"]) {
  return COLUMNS.find((c) => c.key === key)?.ch ?? COLUMNS[0].ch
}

export function textStyle(s: ReadingSettings): CSSProperties {
  return {
    fontFamily: fontStack(s.font),
    fontSize: `${s.fontSize}px`,
    lineHeight: s.lineHeight,
    letterSpacing: `${s.letterSpacing}em`,
    wordSpacing: `${s.wordSpacing}em`,
    textAlign: s.alignment === "justify" ? "justify" : "left",
  }
}

export function surfaceStyle(s: ReadingSettings): CSSProperties {
  const bg = background(s.background)
  return { backgroundColor: bg.surface, color: bg.ink }
}
