import { DashboardPage } from "@/components/dashboard-page"
import { currentUser } from "@/lib/current-user"
import { redirect } from "next/navigation"
import { ProfileContent } from "./profile-content"

export const dynamic = "force-dynamic"

const Page = async () => {
  const user = await currentUser()

  if (!user) {
    redirect("/sign-in")
  }

  return (
    <DashboardPage title="Profile">
      <ProfileContent
        user={user}
      />
    </DashboardPage>
  )
}

export default Page

