import { cookies } from "next/headers"
import { verifyJWT } from "@/lib/jwt"
import { db } from "@/db"

export const currentUser = async () => {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("accessToken")?.value

    if (!accessToken) {
        return null
    }

    const payload = await verifyJWT(accessToken)

    if (!payload || !payload.userId) {
        return null
    }

    const user = await db.user.findUnique({
        where: { id: payload.userId },
    })

    return user
}
