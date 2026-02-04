"use client"

import { SignIn } from "@clerk/nextjs"
import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const Page = () => {
  const { isSignedIn, isLoaded } = useAuth()
  const router = useRouter()
  const [intent, setIntent] = useState<string | null>(null)
  const [isRedirecting, setIsRedirecting] = useState(false)

  // Read search params from URL on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      setIntent(params.get("intent"))
    }
  }, [])

  useEffect(() => {
    // Only redirect if auth is loaded and user is signed in
    if (isLoaded && isSignedIn && !isRedirecting) {
      setIsRedirecting(true)
      const redirectUrl = intent ? `/dashboard?intent=${intent}` : "/dashboard"
      router.replace(redirectUrl) // Use replace instead of push to avoid history issues
    }
  }, [isLoaded, isSignedIn, intent, router, isRedirecting])

  // Show loading state while auth is loading
  if (!isLoaded) {
    return (
      <div className="w-full flex-1 flex items-center justify-center">
        <div>Loading...</div>
      </div>
    )
  }

  // Don't render SignIn if already signed in (prevents the warning)
  if (isSignedIn || isRedirecting) {
    return (
      <div className="w-full flex-1 flex items-center justify-center">
        <div>Redirecting...</div>
      </div>
    )
  }

  const redirectUrl = intent ? `/dashboard?intent=${intent}` : "/dashboard"

  return (
    <div className="w-full flex-1 flex items-center justify-center">
      <SignIn
        forceRedirectUrl={redirectUrl}
        routing="path"
        path="/sign-in"
      />
    </div>
  )
}

export default Page
