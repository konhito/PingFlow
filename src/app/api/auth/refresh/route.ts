import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT, generateTokens } from '@/lib/jwt'
import { db } from '@/db'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies()
        const refreshToken = cookieStore.get('refreshToken')?.value

        if (!refreshToken) {
            return NextResponse.json(
                { error: 'No refresh token provided' },
                { status: 401 }
            )
        }

        // Verify refresh token
        const payload = await verifyJWT(refreshToken)
        if (!payload || !payload.userId) {
            return NextResponse.json(
                { error: 'Invalid refresh token' },
                { status: 401 }
            )
        }

        // Verify token matches database
        const user = await db.user.findUnique({
            where: { id: payload.userId },
        })

        if (!user || user.refreshToken !== refreshToken) {
            return NextResponse.json(
                { error: 'Invalid refresh token' },
                { status: 401 }
            )
        }

        // Generate new tokens
        const newTokens = await generateTokens({
            userId: user.id,
            email: user.email,
            name: user.name || undefined,
            avatar: user.avatar || undefined,
        })

        // Update refresh token in database
        await db.user.update({
            where: { id: user.id },
            data: { refreshToken: newTokens.refreshToken },
        })

        // Set new cookies
        cookieStore.set('accessToken', newTokens.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 15, // 15 minutes
            path: '/',
        })

        cookieStore.set('refreshToken', newTokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Token refresh error:', error)
        return NextResponse.json(
            { error: 'Failed to refresh token' },
            { status: 500 }
        )
    }
}
