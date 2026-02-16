import { DashboardPage } from "@/components/dashboard-page"
import { currentUser } from "@/lib/current-user"
import { redirect } from "next/navigation"
import { UpgradePageContent } from "./upgrade-page-content"

export const dynamic = "force-dynamic"

const Page = async () => {
  const user = await currentUser()

  if (!user) {
    redirect("/sign-in")
  }

  return (
    <DashboardPage title="Pro Membership">
      <UpgradePageContent plan={user.plan} />
    </DashboardPage>
  )
}

export default Page