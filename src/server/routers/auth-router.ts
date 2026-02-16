import { db } from "@/db"
import { verifyJWT } from "@/lib/jwt"
import { cookies } from "next/headers"
import { router } from "../__internals/router"
import { publicProcedure } from "../procedures"

export const dynamic = "force-dynamic"

export const authRouter = router({
  getDatabaseSyncStatus: publicProcedure.query(async ({ c, ctx }) => {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("accessToken")?.value

    if (!accessToken) {
      return c.json({ isSynced: false })
    }

    const payload = await verifyJWT(accessToken)

    if (!payload) {
      return c.json({ isSynced: false })
    }

    const user = await db.user.findFirst({
      where: { id: payload.userId },
    })

    if (!user) {
      return c.json({ isSynced: false })
    }

    return c.json({ isSynced: true })
  }),
})
