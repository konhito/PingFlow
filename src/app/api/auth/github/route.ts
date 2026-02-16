import { NextRequest, NextResponse } from 'next/server'
import { getGitHubOAuthURL } from '@/lib/oauth'

export async function GET(request: NextRequest) {
    try {
        const authUrl = getGitHubOAuthURL()
        return NextResponse.redirect(authUrl)
    } catch (error) {
        console.error('Error initiating GitHub OAuth:', error)
        return NextResponse.redirect(
            new URL('/sign-in?error=oauth_failed', request.url)
        )
    }
}
