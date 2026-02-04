"use client"

import { SignIn } from "@clerk/nextjs"
import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const Page = () => {
  const { isSignedIn } = useAuth()
  const router = useRouter()
  const [intent, setIntent] = useState<string | null>(null)

  // Read search params from URL on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      setIntent(params.get("intent"))
    }
  }, [])

  useEffect(() => {
    if (isSignedIn) {
      // Redirect if already signed in
      const redirectUrl = intent ? `/dashboard?intent=${intent}` : "/dashboard"
      router.push(redirectUrl)
    }
  }, [isSignedIn, intent, router])

  // Don't render SignIn if already signed in (prevents the warning)
  if (isSignedIn) {
    return null
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
