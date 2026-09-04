"use client"

import { useMemo } from "react"
import { ArrowRight, Check } from "lucide-react"
import { LinkButton, MicroLabel } from "@/components/ui"
import { useReading } from "@/components/reading-provider"
import { DEFAULT_SETTINGS, PROFILES } from "@/lib/profiles"
import { surfaceStyle, textStyle } from "@/lib/reading-styles"

export function ProfileView() {
  const { profileId, applyProfile, settings } = useReading()

  // Preview uses the live settings so "Custom" reflects prior tweaks too.
  const previewSettings = useMemo(() => {
    if (profileId === "custom") return settings
    const p = PROFILES.find((x) => x.id === profileId)
    return { ...DEFAULT_SETTINGS, ...(p?.settings ?? {}) }
  }, [profileId, settings])

  return (
    <div className="grid grid-cols-1 gap-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      {/* Profile chooser */}
      <section className="border-b border-dashed border-line py-8 lg:border-b-0 lg:border-r lg:py-12 lg:pr-12">
        <MicroLabel>Step 03 — Reading Profile</MicroLabel>
        <h1 className="mt-4 text-3xl font-bold leading-tight text-ink md:text-4xl">
          How do you read best?
        </h1>
        <p className="mt-3 max-w-md text-pretty text-[15px] leading-relaxed text-ink-secondary">
          Pick a starting point. You can fine-tune every control later in the
          reader — nothing here is permanent.
        </p>

        <div
          role="radiogroup"
          aria-label="Reading profile"
          className="mt-8 border-t border-dashed border-line"
        >
          {PROFILES.map((profile) => {
            const selected = profile.id === profileId
            return (
              <button
                key={profile.id}
                role="radio"
                aria-checked={selected}
                onClick={() => applyProfile(profile.id)}
                className={[
                  "flex w-full items-start gap-4 border-b border-dashed border-line px-1 py-4 text-left transition-colors",
                  selected ? "bg-surface-muted" : "hover:bg-surface-muted/60",
                ].join(" ")}
              >
                <span
                  className={[
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border",
                    selected
                      ? "border-ink bg-ink text-background"
                      : "border-line",
                  ].join(" ")}
                  aria-hidden
                >
                  {selected && <Check className="h-3.5 w-3.5" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="text-base font-semibold text-ink">
                      {profile.name}
                    </span>
                  </span>
                  <span className="mt-1 block text-[13px] leading-relaxed text-ink-secondary">
                    {profile.summary}
                  </span>
                  <span className="mt-2 flex flex-wrap gap-1.5">
                    {profile.details.map((d) => (
                      <span
                        key={d}
                        className="border border-dashed border-line px-1.5 py-0.5 text-[11px] text-ink-muted"
                      >
                        {d}
                      </span>
                    ))}
                  </span>
                </span>
              </button>
            )
          })}
        </div>

        <div className="mt-8">
          <LinkButton href="/reader">
            Open in reader <ArrowRight className="h-3.5 w-3.5" />
          </LinkButton>
        </div>
      </section>

      {/* Live preview */}
      <section className="py-8 lg:py-12 lg:pl-12">
        <div className="flex items-center justify-between">
          <MicroLabel>Live Preview</MicroLabel>
          <span className="caption text-ink-muted">
            {PROFILES.find((p) => p.id === profileId)?.name}
          </span>
        </div>

        <div
          className="mt-4 border border-dashed border-line p-6 transition-colors md:p-8"
          style={surfaceStyle(previewSettings)}
        >
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.15em] opacity-60"
            style={{ fontFamily: textStyle(previewSettings).fontFamily }}
          >
            2.1 Introduction
          </p>
          <div
            style={textStyle(previewSettings)}
            className="mt-4"
          >
            <p style={{ marginBottom: `${previewSettings.paragraphSpacing}em` }}>
              Economic growth is the increase in the production of goods and
              services in an economy over a period of time. It is conventionally
              measured as the percent rate of increase in real gross domestic
              product, or real GDP.
            </p>
            <p>
              Growth is usually calculated in real terms — adjusted for
              inflation — to eliminate the distorting effect of rising prices on
              the value of what an economy produces.
            </p>
          </div>
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
          <PreviewStat label="Font" value={fontLabel(previewSettings.font)} />
          <PreviewStat label="Size" value={`${previewSettings.fontSize}px`} />
          <PreviewStat label="Line height" value={previewSettings.lineHeight.toFixed(2)} />
          <PreviewStat
            label="Letter spacing"
            value={`${previewSettings.letterSpacing.toFixed(2)}em`}
          />
          <PreviewStat label="Width" value={cap(previewSettings.columnWidth)} />
          <PreviewStat
            label="Background"
            value={cap(previewSettings.background)}
          />
        </dl>
      </section>
    </div>
  )
}

function PreviewStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-dashed border-line px-3 py-2">
      <dt className="micro-label">{label}</dt>
      <dd className="mt-0.5 text-[13px] font-medium text-ink">{value}</dd>
    </div>
  )
}

function fontLabel(key: string) {
  const map: Record<string, string> = {
    system: "System",
    lexend: "Lexend",
    atkinson: "Atkinson",
    opendyslexic: "OpenDyslexic",
  }
  return map[key] ?? key
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
