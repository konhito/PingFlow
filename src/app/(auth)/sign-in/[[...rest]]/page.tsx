"use client"

import { SignIn } from "@clerk/nextjs"
import { useAuth, useSearchParams } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const Page = () => {
  const { isSignedIn } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const intent = searchParams.get("intent")

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

  return (
    <div className="w-full flex-1 flex items-center justify-center">
      <SignIn
        forceRedirectUrl={intent ? `/dashboard?intent=${intent}` : "/dashboard"}
        routing="path"
        path="/sign-in"
      />
    </div>
  )
}

export default Page
