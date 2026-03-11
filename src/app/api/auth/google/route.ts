import { NextRequest, NextResponse } from 'next/server'
import { getGoogleOAuthURL } from '@/lib/oauth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    try {
        const authUrl = getGoogleOAuthURL()
        return NextResponse.redirect(authUrl)
    } catch (error) {
        console.error('Error initiating Google OAuth:', error)
        return NextResponse.redirect(
            new URL('/sign-in?error=oauth_failed', request.url)
        )
    }
}
