"use client"

import { SignUp } from "@clerk/nextjs"
import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const Page = () => {
  const { isSignedIn } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isSignedIn) {
      // Redirect if already signed in
      router.push("/welcome")
    }
  }, [isSignedIn, router])

  // Don't render SignUp if already signed in
  if (isSignedIn) {
    return null
  }

  return (
    <div className="w-full flex-1 flex items-center justify-center">
      <SignUp 
        fallbackRedirectUrl="/welcome" 
        forceRedirectUrl="/welcome"
        routing="path"
        path="/sign-up"
      />
    </div>
  )
}

export default Page
