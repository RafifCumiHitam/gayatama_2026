import type { Metadata } from "next"
import { WorkflowHeader } from "@/components/workflow-header"
import { ScoreView } from "@/components/score-view"

export const metadata: Metadata = {
  title: "Accessibility Score — ReadAble",
  description:
    "See how your document scored before and after ReadAble's accessibility transformation.",
}

export default function ScorePage() {
  return (
    <div className="min-h-screen">
      <WorkflowHeader current="score" />
      <main className="mx-auto max-w-[1440px] px-4 md:px-8">
        <ScoreView />
      </main>
    </div>
  )
}
