import { DashboardPage } from "@/components/dashboard-page"
import { currentUser } from "@/lib/current-user"
import { redirect } from "next/navigation"
import { AccountSettings } from "./settings-page-content"

export const dynamic = "force-dynamic"

const Page = async () => {
  const user = await currentUser()

  if (!user) {
    redirect("/sign-in")
  }

  return (
    <DashboardPage title="Account Settings">
      <AccountSettings
        discordId={user.discordId ?? ""}
        whatsappId={user.whatsappId ?? ""}
        telegramId={user.telegramId ?? ""}
        notificationEmail={user.notificationEmail ?? user.email}
      />
    </DashboardPage>
  )
}

export default Page
