import { NextRequest, NextResponse } from 'next/server'
import { getGitHubUser } from '@/lib/oauth'
import { generateTokens } from '@/lib/jwt'
import { db } from '@/db'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const code = searchParams.get('code')
        const error = searchParams.get('error')

        if (error || !code) {
            return NextResponse.redirect(
                new URL('/sign-in?error=oauth_failed', request.url)
            )
        }

        // Exchange code for user info
        const githubUser = await getGitHubUser(code)

        if (!githubUser.email) {
            return NextResponse.redirect(
                new URL('/sign-in?error=email_required', request.url)
            )
        }

        // Create or update user in database
        const { accessToken, refreshToken } = await generateTokens({
            userId: '', // Will be set after user creation
            email: githubUser.email,
            name: githubUser.name || githubUser.login,
            avatar: githubUser.avatar_url,
        })

        // Check if user already exists by email
        let user = await db.user.findUnique({
            where: { email: githubUser.email },
        })

        if (user) {
            // User exists, update them
            user = await db.user.update({
                where: { id: user.id },
                data: {
                    name: (githubUser.name || githubUser.login) || user.name,
                    avatar: githubUser.avatar_url || user.avatar,
                    provider: 'GITHUB', // Update provider
                    providerId: githubUser.id.toString(),
                    refreshToken,
                    updatedAt: new Date(),
                },
            })
        } else {
            // User doesn't exist, create them
            user = await db.user.create({
                data: {
                    email: githubUser.email,
                    name: githubUser.name || githubUser.login,
                    avatar: githubUser.avatar_url,
                    provider: 'GITHUB',
                    providerId: githubUser.id.toString(),
                    refreshToken,
                    quotaLimit: 100, // Default quota for free tier
                    plan: 'FREE',
                },
            })
        }

        // Generate new tokens with actual user ID
        const finalTokens = await generateTokens({
            userId: user.id,
            email: user.email,
            name: user.name || undefined,
            avatar: user.avatar || undefined,
        })

        // Update refresh token in database
        await db.user.update({
            where: { id: user.id },
            data: { refreshToken: finalTokens.refreshToken },
        })

        // Set HTTP-only cookies
        const cookieStore = await cookies()
        cookieStore.set('accessToken', finalTokens.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 15, // 15 minutes
            path: '/',
        })

        cookieStore.set('refreshToken', finalTokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        })

        // Redirect to dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url))
    } catch (error) {
        console.error('GitHub OAuth callback error:', error)
        return NextResponse.redirect(
            new URL('/sign-in?error=oauth_failed', request.url)
        )
    }
}
