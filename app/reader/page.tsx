import type { Metadata } from "next"
import { WorkflowHeader } from "@/components/workflow-header"
import { ReaderShell } from "@/components/reader/reader-shell"

export const metadata: Metadata = {
  title: "Reader — Readable",
  description:
    "Read your document in a fully adjustable, accessible reading environment.",
}

export default function ReaderPage() {
  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <WorkflowHeader step={4} />
      <ReaderShell />
    </div>
  )
}
