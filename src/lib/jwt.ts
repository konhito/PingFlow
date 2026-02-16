import { SignJWT, jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-secret-key-min-32-characters-long'
)

export interface JWTPayload {
    userId: string
    email: string
    name?: string
    avatar?: string
    iat?: number
    exp?: number
}

/**
 * Sign a JWT token with user data
 * @param payload - User data to encode in the token
 * @param expiresIn - Token expiration time (default: 15 minutes for access token)
 */
export async function signJWT(
    payload: JWTPayload,
    expiresIn: string = '15m'
): Promise<string> {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(expiresIn)
        .sign(JWT_SECRET)
}

/**
 * Verify and decode a JWT token
 * @param token - JWT token to verify
 * @returns Decoded payload if valid
 */
export async function verifyJWT(token: string): Promise<JWTPayload | null> {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET)
        return payload as JWTPayload
    } catch (error) {
        console.error('JWT verification failed:', error)
        return null
    }
}

/**
 * Generate both access and refresh tokens
 * @param payload - User data to encode
 */
export async function generateTokens(payload: JWTPayload) {
    const accessToken = await signJWT(payload, '15m') // 15 minutes
    const refreshToken = await signJWT(payload, '7d') // 7 days

    return { accessToken, refreshToken }
}
