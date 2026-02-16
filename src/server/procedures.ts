import { db } from "@/db"
import { j } from "./__internals/j"
import { verifyJWT } from "@/lib/jwt"
import { HTTPException } from "hono/http-exception"
import { cookies } from "next/headers"

const authMiddleware = j.middleware(async ({ c, next }) => {
  const authHeader = c.req.header("Authorization")

  if (authHeader) {
    const apiKey = authHeader.split(" ")[1] // bearer <API_KEY>

    const user = await db.user.findUnique({
      where: { apiKey },
    })

    if (user) return next({ user })
  }

  // Get access token from cookies
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value

  if (!accessToken) {
    throw new HTTPException(401, { message: "Unauthorized" })
  }

  const payload = await verifyJWT(accessToken)

  if (!payload || !payload.userId) {
    throw new HTTPException(401, { message: "Unauthorized" })
  }

  const user = await db.user.findUnique({
    where: { id: payload.userId },
  })

  if (!user) {
    throw new HTTPException(401, { message: "Unauthorized" })
  }

  return next({ user })
})

/**
 * Public (unauthenticated) procedures
 *
 * This is the base piece you use to build new queries and mutations on your API.
 */
export const baseProcedure = j.procedure
export const publicProcedure = baseProcedure
export const privateProcedure = publicProcedure.use(authMiddleware)