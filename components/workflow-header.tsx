import Link from "next/link"
import { Logo } from "@/components/site-header"

const STEPS = [
  { id: "upload", label: "Upload", href: "/" },
  { id: "processing", label: "Process", href: "/processing" },
  { id: "profile", label: "Profile", href: "/profile" },
  { id: "reader", label: "Read", href: "/reader" },
  { id: "score", label: "Score", href: "/score" },
  { id: "export", label: "Export", href: "/export" },
]

export function WorkflowHeader({ current }: { current: string }) {
  const currentIndex = STEPS.findIndex((s) => s.id === current)

  return (
    <header className="border-b border-dashed border-line">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-6 px-4 md:px-8">
        <Logo />
        <nav aria-label="Progress" className="hidden md:block">
          <ol className="flex items-center gap-1">
            {STEPS.map((step, i) => {
              const done = i < currentIndex
              const isCurrent = i === currentIndex
              return (
                <li key={step.id} className="flex items-center gap-1">
                  <Link
                    href={step.href}
                    aria-current={isCurrent ? "step" : undefined}
                    className={[
                      "flex items-center gap-2 px-2.5 py-1 text-[11px] uppercase tracking-[0.12em] transition-colors",
                      isCurrent
                        ? "font-semibold text-ink"
                        : done
                          ? "text-ink-secondary hover:text-ink"
                          : "text-ink-disabled",
                    ].join(" ")}
                  >
                    <span className="font-mono">{String(i + 1).padStart(2, "0")}</span>
                    {step.label}
                  </Link>
                  {i < STEPS.length - 1 && (
                    <span className="h-px w-4 bg-line-light" aria-hidden />
                  )}
                </li>
              )
            })}
          </ol>
        </nav>
        <span className="micro-label md:hidden">
          Step {currentIndex + 1} / {STEPS.length}
        </span>
      </div>
    </header>
  )
}
