interface GoogleTokenResponse {
    access_token: string
    expires_in: number
    scope: string
    token_type: string
    id_token: string
}

interface GoogleUserInfo {
    id: string
    email: string
    verified_email: boolean
    name: string
    given_name: string
    family_name: string
    picture: string
}

interface GitHubTokenResponse {
    access_token: string
    token_type: string
    scope: string
}

interface GitHubUserInfo {
    id: number
    login: string
    name: string
    email: string
    avatar_url: string
}

interface GitHubEmail {
    email: string
    primary: boolean
    verified: boolean
    visibility: string | null
}

/**
 * Generate Google OAuth authorization URL
 */
export function getGoogleOAuthURL(): string {
    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth'

    const options = {
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/google/callback`,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        access_type: 'offline',
        response_type: 'code',
        prompt: 'consent',
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
        ].join(' '),
    }

    const qs = new URLSearchParams(options)
    return `${rootUrl}?${qs.toString()}`
}

/**
 * Exchange Google authorization code for user info
 */
export async function getGoogleUser(code: string): Promise<GoogleUserInfo> {
    const tokenUrl = 'https://oauth2.googleapis.com/token'

    const values = {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/google/callback`,
        grant_type: 'authorization_code',
    }

    const tokenResponse = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(values),
    })

    if (!tokenResponse.ok) {
        throw new Error('Failed to fetch Google OAuth tokens')
    }

    const tokens: GoogleTokenResponse = await tokenResponse.json()

    // Get user info
    const userInfoResponse = await fetch(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`
    )

    if (!userInfoResponse.ok) {
        throw new Error('Failed to fetch Google user info')
    }

    return userInfoResponse.json()
}

/**
 * Generate GitHub OAuth authorization URL
 */
export function getGitHubOAuthURL(): string {
    const rootUrl = 'https://github.com/login/oauth/authorize'

    const options = {
        client_id: process.env.GITHUB_CLIENT_ID!,
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/github/callback`,
        scope: 'user:email',
    }

    const qs = new URLSearchParams(options)
    return `${rootUrl}?${qs.toString()}`
}

/**
 * Exchange GitHub authorization code for user info
 */
export async function getGitHubUser(code: string): Promise<GitHubUserInfo> {
    const tokenUrl = 'https://github.com/login/oauth/access_token'

    const values = {
        code,
        client_id: process.env.GITHUB_CLIENT_ID!,
        client_secret: process.env.GITHUB_CLIENT_SECRET!,
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/github/callback`,
    }

    const tokenResponse = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
        },
        body: new URLSearchParams(values),
    })

    if (!tokenResponse.ok) {
        throw new Error('Failed to fetch GitHub OAuth tokens')
    }

    const tokens: GitHubTokenResponse = await tokenResponse.json()

    // Get user info
    const userInfoResponse = await fetch('https://api.github.com/user', {
        headers: {
            Authorization: `Bearer ${tokens.access_token}`,
        },
    })

    if (!userInfoResponse.ok) {
        throw new Error('Failed to fetch GitHub user info')
    }

    const userInfo: GitHubUserInfo = await userInfoResponse.json()

    // If email is not public, fetch it separately
    if (!userInfo.email) {
        const emailResponse = await fetch('https://api.github.com/user/emails', {
            headers: {
                Authorization: `Bearer ${tokens.access_token}`,
            },
        })

        if (emailResponse.ok) {
            const emails: GitHubEmail[] = await emailResponse.json()
            const primaryEmail = emails.find((e) => e.primary && e.verified)
            if (primaryEmail) {
                userInfo.email = primaryEmail.email
            }
        }
    }

    return userInfo
}
