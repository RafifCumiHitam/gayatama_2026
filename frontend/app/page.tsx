import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { UploadZone } from "@/components/upload-zone"
import { MicroLabel, Panel } from "@/components/ui"
import {
  Type,
  Focus,
  Ruler,
  Volume2,
  AlignLeft,
  Gauge,
} from "lucide-react"

const steps = [
  { n: "01", label: "Upload", desc: "PDF, DOCX, or image" },
  { n: "02", label: "Parse", desc: "Extract text & structure" },
  { n: "03", label: "Reflow", desc: "Single readable flow" },
  { n: "04", label: "Profile", desc: "Tune to how you read" },
  { n: "05", label: "Export", desc: "Take it anywhere" },
]

const features = [
  { icon: Type, label: "Adaptive Typography" },
  { icon: Focus, label: "Focus Reading" },
  { icon: Ruler, label: "Reading Ruler" },
  { icon: Volume2, label: "Text-to-Speech" },
  { icon: AlignLeft, label: "Document Reflow" },
  { icon: Gauge, label: "Accessibility Analysis" },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-[1440px] px-4 md:px-8">
        {/* Hero + workflow */}
        <div className="grid grid-cols-1 gap-0 lg:grid-cols-[1fr_320px]">
          {/* Hero column */}
          <section className="border-b border-dashed border-line py-12 lg:border-b-0 lg:border-r lg:py-16 lg:pr-12">
            <MicroLabel>Universal Accessible Document Converter</MicroLabel>
            <h1 className="mt-5 max-w-2xl text-balance text-4xl font-bold leading-[1.1] text-ink md:text-5xl lg:text-[56px] lg:leading-[1.05]">
              Turn any document into a reading experience that works for you.
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-ink-secondary">
              Upload a PDF, DOCX, or image. We parse the structure, reflow the
              layout, and produce an accessible version tailored to how you
              read.
            </p>

            <div className="mt-10 max-w-2xl">
              <UploadZone />
            </div>

            {/* Feature highlights */}
            <div
              id="about"
              className="mt-14 grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3"
            >
              {features.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <Icon
                    className="h-5 w-5 shrink-0 text-ink-secondary"
                    strokeWidth={1.75}
                  />
                  <span className="text-[13px] text-ink">{label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Right rail: How it works + score teaser */}
          <aside
            id="how-it-works"
            className="flex flex-col gap-0 py-8 lg:py-16 lg:pl-8"
          >
            <div>
              <MicroLabel>How It Works</MicroLabel>
              <ol className="mt-5 divide-y divide-dashed divide-line border-y border-dashed border-line">
                {steps.map((step) => (
                  <li key={step.n} className="flex items-baseline gap-4 py-3.5">
                    <span className="w-6 shrink-0 font-mono text-[13px] text-ink-muted">
                      {step.n}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-ink">
                        {step.label}
                      </p>
                      <p className="caption text-ink-muted">{step.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <Panel className="mt-8 p-5">
              <MicroLabel>Accessibility Score</MicroLabel>
              <div className="mt-3 flex items-end gap-2">
                <span className="text-5xl font-bold leading-none text-ink">
                  54
                </span>
                <span className="pb-1 text-sm text-ink-muted">/ 100</span>
                <span className="ml-auto pb-1 text-[13px] text-ink-secondary">
                  before
                </span>
              </div>
              <div className="mt-4 h-px w-full bg-line-light" />
              <div className="mt-4 flex items-end gap-2">
                <span className="text-5xl font-bold leading-none text-success">
                  82
                </span>
                <span className="pb-1 text-sm text-ink-muted">/ 100</span>
                <span className="ml-auto pb-1 text-[13px] text-ink-secondary">
                  after
                </span>
              </div>
              <p className="caption mt-4 text-ink-muted">
                Every document gets a before/after accessibility analysis so you
                can see exactly what changed.
              </p>
            </Panel>
          </aside>
        </div>
      </main>

      <footer className="border-t border-dashed border-line">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-2 px-4 py-6 text-[13px] text-ink-muted md:flex-row md:px-8">
          <p>ReadAble — change how the document is presented, not what it says.</p>
          <p>
            <Link href="/reader" className="hover:text-ink">
              Open the reader
            </Link>
          </p>
        </div>
      </footer>
    </div>
  )
}
