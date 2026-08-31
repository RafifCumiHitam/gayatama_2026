import Link from "next/link"
import type { ComponentProps, ReactNode } from "react"

/* ---------- Button ---------- */

type ButtonVariant = "primary" | "secondary" | "ghost"

const buttonBase =
  "inline-flex items-center justify-center gap-2 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.15em] transition-colors select-none disabled:cursor-not-allowed disabled:opacity-50"

const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "bg-ink text-background border border-ink hover:bg-ink-secondary hover:border-ink-secondary",
  secondary:
    "bg-transparent text-ink border border-dashed border-ink hover:bg-surface-muted",
  ghost: "bg-transparent text-ink-secondary hover:text-ink hover:bg-surface-muted",
}

export function Button({
  variant = "primary",
  className = "",
  ...props
}: { variant?: ButtonVariant } & ComponentProps<"button">) {
  return (
    <button
      className={`${buttonBase} ${buttonVariants[variant]} ${className}`}
      {...props}
    />
  )
}

export function LinkButton({
  variant = "primary",
  className = "",
  ...props
}: { variant?: ButtonVariant } & ComponentProps<typeof Link>) {
  return (
    <Link
      className={`${buttonBase} ${buttonVariants[variant]} ${className}`}
      {...props}
    />
  )
}

/* ---------- Micro label ---------- */

export function MicroLabel({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return <p className={`micro-label ${className}`}>{children}</p>
}

/* ---------- Format chip ---------- */

export function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center border border-dashed border-line px-2 py-0.5 text-[11px] text-ink-secondary">
      {children}
    </span>
  )
}

/* ---------- Panel ---------- */

export function Panel({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode
  className?: string
  as?: "div" | "section" | "aside"
}) {
  return (
    <Tag className={`border border-dashed border-line bg-surface ${className}`}>
      {children}
    </Tag>
  )
}
