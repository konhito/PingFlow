import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyJWT, generateTokens } from './lib/jwt'

// Routes that require authentication
const protectedRoutes = ['/dashboard']

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ['/sign-in', '/sign-up']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )

  // Check if the route is an auth route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // Get tokens from cookies
  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value

  // Verify access token
  let isAuthenticated = false
  if (accessToken) {
    const payload = await verifyJWT(accessToken)
    isAuthenticated = !!payload
  }

  // If protected route and not authenticated, redirect to sign-in
  if (isProtectedRoute && !isAuthenticated) {
    const signInUrl = new URL('/sign-in', request.url)
    signInUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(signInUrl)
  }

  // If auth route and authenticated, redirect to dashboard
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // If access token expired but refresh token exists, try to refresh
  if (isProtectedRoute && !isAuthenticated && refreshToken) {
    try {
      const refreshPayload = await verifyJWT(refreshToken)
      if (refreshPayload) {
        // Generate new tokens to extend session (rolling window)
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await generateTokens({
          userId: refreshPayload.userId,
          email: refreshPayload.email,
          name: refreshPayload.name,
          avatar: refreshPayload.avatar
        })

        // Create response and set new cookies
        const response = NextResponse.next()

        response.cookies.set('accessToken', newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 15 * 60, // 15 mins
          path: '/',
        })

        response.cookies.set('refreshToken', newRefreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 7 * 24 * 60 * 60, // 7 days
          path: '/',
        })

        return response
      }
    } catch (error) {
      // Refresh token invalid, redirect to sign-in
      const signInUrl = new URL('/sign-in', request.url)
      signInUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(signInUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
