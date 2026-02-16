import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { verifyJWT } from "@/lib/jwt"
import { cookies } from "next/headers"

export async function PATCH(req: NextRequest) {
    try {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get("accessToken")?.value

        if (!accessToken) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        const payload = await verifyJWT(accessToken)

        if (!payload || !payload.userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const { name, email } = body // Simplified for now, can add more fields

        // Validate body if needed

        const updatedUser = await db.user.update({
            where: { id: payload.userId },
            data: {
                name,
            } as any,
        })

        return NextResponse.json({ success: true, user: updatedUser })
    } catch (error) {
        console.error("Update profile error:", error)
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
}
