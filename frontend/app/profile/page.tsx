import { WorkflowHeader } from "@/components/workflow-header"
import { ProfileView } from "@/components/profile-view"

export default function ProfilePage() {
  return (
    <div className="min-h-screen">
      <WorkflowHeader current="profile" />
      <main className="mx-auto max-w-[1440px] px-4 md:px-8">
        <ProfileView />
      </main>
    </div>
  )
}
