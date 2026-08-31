import Link from "next/link"

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`text-sm font-bold uppercase tracking-[0.25em] text-ink ${className}`}
    >
      ReadAble
    </Link>
  )
}

const nav = [
  { label: "Product", href: "/" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "About", href: "/#about" },
]

export function SiteHeader() {
  return (
    <header className="border-b border-dashed border-line">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 md:px-8 lg:h-[72px]">
        <Logo />
        <nav aria-label="Primary" className="flex items-center gap-6">
          <ul className="hidden items-center gap-6 md:flex">
            {nav.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="text-[13px] text-ink-secondary transition-colors hover:text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/reader"
            className="text-[13px] font-medium text-ink transition-colors hover:text-ink-secondary"
          >
            Sign In
          </Link>
        </nav>
      </div>
    </header>
  )
}
