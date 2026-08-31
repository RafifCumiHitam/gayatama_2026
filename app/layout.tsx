import type { Metadata, Viewport } from "next"
import { Inter, Lexend, Atkinson_Hyperlegible } from "next/font/google"
import { ReadingProvider } from "@/components/reading-provider"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
  display: "swap",
})

const atkinson = Atkinson_Hyperlegible({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-atkinson",
  display: "swap",
})

export const metadata: Metadata = {
  title: "ReadAble — Turn any document into a reading experience that works for you",
  description:
    "ReadAble is a universal accessible document converter. Upload a PDF, DOCX, or image and get an accessible, reflowed, personalized reading experience — you control typography, spacing, focus, and more.",
  generator: "v0.app",
  applicationName: "ReadAble",
  keywords: [
    "accessibility",
    "dyslexia",
    "document converter",
    "reading",
    "reflow",
    "text-to-speech",
  ],
}

export const viewport: Viewport = {
  themeColor: "#f4f2ee",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`bg-background ${inter.variable} ${lexend.variable} ${atkinson.variable}`}
    >
      <body>
        <ReadingProvider>{children}</ReadingProvider>
      </body>
    </html>
  )
}
