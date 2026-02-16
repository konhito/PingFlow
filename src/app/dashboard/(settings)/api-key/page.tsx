import { DashboardPage } from "@/components/dashboard-page"
import { currentUser } from "@/lib/current-user"
import { redirect } from "next/navigation"
import { ApiKeySettings } from "./api-key-settings"

export const dynamic = "force-dynamic"

const Page = async () => {
  const user = await currentUser()

  if (!user) {
    redirect("/sign-in")
  }

  return (
    <DashboardPage title="API Key">
      <ApiKeySettings apiKey={user.apiKey ?? ""} />
    </DashboardPage>
  )
}

export default Page
