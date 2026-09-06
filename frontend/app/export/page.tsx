import type { Metadata } from "next"
import { WorkflowHeader } from "@/components/workflow-header"
import { ExportView } from "@/components/export-view"

export const metadata: Metadata = {
  title: "Export — ReadAble",
  description:
    "Download your accessible document as PDF, HTML, or other formats.",
}

export default function ExportPage() {
  return (
    <div className="min-h-screen">
      <WorkflowHeader current="export" />
      <main className="mx-auto max-w-[1440px] px-4 md:px-8">
        <ExportView />
      </main>
    </div>
  )
}
