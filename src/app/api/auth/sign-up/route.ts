import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { generateTokens } from "@/lib/jwt"
import { hash } from "bcryptjs"
import { cookies } from "next/headers"

export async function POST(req: NextRequest) {
    try {
        const { email, password, name } = await req.json()

        if (!email || !password) {
            return NextResponse.json(
                { message: "Email and password are required" },
                { status: 400 }
            )
        }

        const existingUser = await db.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return NextResponse.json(
                { message: "User already exists" },
                { status: 400 }
            )
        }

        const hashedPassword = await hash(password, 10)

        const user = await db.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                provider: "EMAIL",
                providerId: email,
                quotaLimit: 100,
                apiKey: "key_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
            },
        })

        // WAIT: provider is an enum. I need to update the enum in prisma schema first if I want to support email/password correctly as a provider type, or just reuse one and ignore it.
        // The plan didn't explicitly say "Add EMAIL to AuthProvider enum".
        // I should check the schema again. `enum AuthProvider { GOOGLE GITHUB }`.
        // I MUST update the schema to include `EMAIL`.

        const { accessToken, refreshToken } = await generateTokens({
            userId: user.id,
            email: user.email,
        })

        const cookieStore = await cookies()

        cookieStore.set("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 15 * 60, // 15 mins
            path: "/",
        })

        cookieStore.set("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: "/",
        })

        return NextResponse.json({ success: true, user: { id: user.id, email: user.email, name: user.name } })
    } catch (error) {
        console.error("Sign up error:", error)
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
}
