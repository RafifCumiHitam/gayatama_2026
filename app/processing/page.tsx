import { WorkflowHeader } from "@/components/workflow-header"
import { ProcessingView } from "@/components/processing-view"

export default function ProcessingPage() {
  return (
    <div className="min-h-screen">
      <WorkflowHeader current="processing" />
      <main className="mx-auto max-w-[1440px] px-4 md:px-8">
        <ProcessingView />
      </main>
    </div>
  )
}
