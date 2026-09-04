"use client"

import { RotateCcw } from "lucide-react"
import { useReading } from "@/components/reading-provider"
import {
  BACKGROUNDS,
  COLUMNS,
  FONTS,
  type ReadingSettings,
} from "@/lib/profiles"
import { MicroLabel } from "@/components/ui"

export function ControlsPanel() {
  const { settings, setSetting, reset, profileId } = useReading()

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-dashed border-line px-4 py-3">
        <MicroLabel>Reading Controls</MicroLabel>
        <button
          onClick={reset}
          className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.12em] text-ink-muted transition-colors hover:text-ink"
        >
          <RotateCcw className="h-3 w-3" /> Reset
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5">
        <Group label="Font">
          <div className="grid grid-cols-2 gap-1.5">
            {FONTS.map((f) => (
              <SegBtn
                key={f.key}
                active={settings.font === f.key}
                onClick={() => setSetting("font", f.key)}
                style={{ fontFamily: f.stack }}
              >
                {f.label}
              </SegBtn>
            ))}
          </div>
        </Group>

        <Group label="Text size">
          <Slider
            min={14}
            max={28}
            step={1}
            value={settings.fontSize}
            onChange={(v) => setSetting("fontSize", v)}
            display={`${settings.fontSize}px`}
          />
        </Group>
        <Group label="Line height">
          <Slider
            min={1.2}
            max={2.4}
            step={0.05}
            value={settings.lineHeight}
            onChange={(v) => setSetting("lineHeight", v)}
            display={settings.lineHeight.toFixed(2)}
          />
        </Group>
        <Group label="Letter spacing">
          <Slider
            min={0}
            max={0.16}
            step={0.005}
            value={settings.letterSpacing}
            onChange={(v) => setSetting("letterSpacing", v)}
            display={`${settings.letterSpacing.toFixed(3)}em`}
          />
        </Group>
        <Group label="Word spacing">
          <Slider
            min={0}
            max={0.4}
            step={0.01}
            value={settings.wordSpacing}
            onChange={(v) => setSetting("wordSpacing", v)}
            display={`${settings.wordSpacing.toFixed(2)}em`}
          />
        </Group>
        <Group label="Paragraph spacing">
          <Slider
            min={0.8}
            max={2.6}
            step={0.1}
            value={settings.paragraphSpacing}
            onChange={(v) => setSetting("paragraphSpacing", v)}
            display={`${settings.paragraphSpacing.toFixed(1)}em`}
          />
        </Group>

        <Group label="Reading width">
          <div className="grid grid-cols-3 gap-1.5">
            {COLUMNS.map((c) => (
              <SegBtn
                key={c.key}
                active={settings.columnWidth === c.key}
                onClick={() => setSetting("columnWidth", c.key)}
              >
                {c.label}
              </SegBtn>
            ))}
          </div>
        </Group>

        <Group label="Alignment">
          <div className="grid grid-cols-2 gap-1.5">
            <SegBtn
              active={settings.alignment === "left"}
              onClick={() => setSetting("alignment", "left")}
            >
              Left
            </SegBtn>
            <SegBtn
              active={settings.alignment === "justify"}
              onClick={() => setSetting("alignment", "justify")}
            >
              Justify
            </SegBtn>
          </div>
        </Group>

        <Group label="Background">
          <div className="flex flex-wrap gap-2">
            {BACKGROUNDS.map((b) => (
              <button
                key={b.key}
                onClick={() => setSetting("background", b.key)}
                aria-label={b.aria}
                aria-pressed={settings.background === b.key}
                title={b.label}
                className={[
                  "h-8 w-8 border transition-transform",
                  settings.background === b.key
                    ? "border-ink ring-1 ring-ink ring-offset-2 ring-offset-surface"
                    : "border-line hover:scale-105",
                ].join(" ")}
                style={{ backgroundColor: b.surface }}
              />
            ))}
          </div>
        </Group>

        <Group label="Reading aids">
          <div className="flex flex-col gap-1">
            <Toggle
              label="Reading ruler"
              hint="Highlight the line under your cursor"
              checked={settings.ruler}
              onChange={(v) => setSetting("ruler", v)}
            />
            <Toggle
              label="Focus mode"
              hint="Dim everything but the active paragraph"
              checked={settings.focusLines > 0}
              onChange={(v) => setSetting("focusLines", v ? 3 : 0)}
            />
            <Toggle
              label="Highlight paragraph"
              hint="Shade the paragraph you're reading"
              checked={settings.highlightParagraph}
              onChange={(v) => setSetting("highlightParagraph", v)}
            />
            <Toggle
              label="Hide footnotes"
              hint="Remove footnotes from the flow"
              checked={settings.hideFootnotes}
              onChange={(v) => setSetting("hideFootnotes", v)}
            />
          </div>
        </Group>

        <p className="mt-6 border-t border-dashed border-line pt-4 caption text-ink-muted">
          {profileId === "custom"
            ? "Custom profile — your manual adjustments are active."
            : `Based on the ${profileLabel(profileId)} profile. Any change switches to Custom.`}
        </p>
      </div>
    </div>
  )
}

function profileLabel(id: string) {
  return id.charAt(0).toUpperCase() + id.slice(1)
}

function Group({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="mb-6">
      <p className="micro-label mb-2.5">{label}</p>
      {children}
    </div>
  )
}

function SegBtn({
  active,
  children,
  style,
  onClick,
}: {
  active: boolean
  children: React.ReactNode
  style?: React.CSSProperties
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={style}
      aria-pressed={active}
      className={[
        "border px-2 py-2 text-[12px] transition-colors",
        active
          ? "border-ink bg-ink text-background"
          : "border-line text-ink hover:bg-surface-muted",
      ].join(" ")}
    >
      {children}
    </button>
  )
}

function Slider({
  min,
  max,
  step,
  value,
  onChange,
  display,
}: {
  min: number
  max: number
  step: number
  value: number
  onChange: (v: number) => void
  display: string
}) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1"
      />
      <span className="w-16 shrink-0 text-right font-mono text-[12px] text-ink-secondary">
        {display}
      </span>
    </div>
  )
}

function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string
  hint: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex items-start justify-between gap-3 border border-dashed border-line px-3 py-2.5 text-left transition-colors hover:bg-surface-muted"
    >
      <span>
        <span className="block text-[13px] font-medium text-ink">{label}</span>
        <span className="mt-0.5 block caption text-ink-muted">{hint}</span>
      </span>
      <span
        aria-hidden
        className={[
          "mt-0.5 flex h-4 w-7 shrink-0 items-center border p-0.5 transition-colors",
          checked ? "border-ink bg-ink" : "border-line bg-transparent",
        ].join(" ")}
      >
        <span
          className={[
            "h-2.5 w-2.5 transition-transform",
            checked
              ? "translate-x-3 bg-background"
              : "translate-x-0 bg-ink-disabled",
          ].join(" ")}
        />
      </span>
    </button>
  )
}
