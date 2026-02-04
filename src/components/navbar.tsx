"use client"

import Link from "next/link"
import { MaxWidthWrapper } from "./max-width-wrapper"
import { SignOutButton, useUser } from "@clerk/nextjs"
import { Button, buttonVariants } from "./ui/button"
import { ArrowRight } from "lucide-react"
import { ModeToggle } from "./mode-toggle"

// Check if Clerk is available (has valid key)
const isClerkAvailable = () => {
  if (typeof window === 'undefined') {
    // During SSR/SSG, check environment variable
    const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    return key && (key.startsWith('pk_test_') || key.startsWith('pk_live_'))
  }
  // On client, ClerkProvider should be available if it was rendered
  return true
}

function NavbarWithClerk() {
  const { user, isLoaded } = useUser()

  // Show loading state to prevent flickering
  if (!isLoaded) {
    return (
      <nav className="sticky z-50 h-16 inset-x-0 top-0 w-full border-b border-gray-200 bg-white/80 backdrop-blur-lg transition-all dark:bg-dark-background dark:bg-dark-background/80 dark:backdrop-blur-lg dark:transition-all dark:border-gray-700">
        <MaxWidthWrapper>
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex z-40 font-semibold dark:text-zinc-300">
              Ping<span className="text-brand-700 dark:text-brand-600">Flow</span>
            </Link>
            <div className="h-full flex items-center space-x-4 dark:text-zinc-300">
              <div className="animate-pulse h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </div>
        </MaxWidthWrapper>
      </nav>
    )
  }

  return (
    <nav className="sticky z-50 h-16 inset-x-0 top-0 w-full border-b border-gray-200 bg-white/80 backdrop-blur-lg transition-all dark:bg-dark-background dark:bg-dark-background/80 dark:backdrop-blur-lg dark:transition-all dark:border-gray-700">
      <MaxWidthWrapper>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex z-40 font-semibold dark:text-zinc-300">
            Ping<span className="text-brand-700 dark:text-brand-600">Flow</span>
          </Link>

          <div className="h-full flex items-center space-x-4 dark:text-zinc-300">
            {user ? (
              <>
                <SignOutButton>
                  <Button size="sm" variant="ghost">
                    Sign out
                  </Button>
                </SignOutButton>

                <Link
                  href="/dashboard"
                  className={buttonVariants({
                    size: "sm",
                    className: "flex items-center gap-1",
                  })}
                >
                  Dashboard <ArrowRight className="ml-1.5 size-4" />
                </Link>
                <div className="ml-1">
                  <ModeToggle />
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/pricing"
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                >
                  Pricing
                </Link>
                <Link
                  href="/sign-in"
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                >
                  Sign in
                </Link>

                <div className="h-8 w-px bg-gray-200" />

                <Link
                  href="/sign-up"
                  className={buttonVariants({
                    size: "sm",
                    className: "flex items-center gap-1.5",
                  })}
                >
                  Sign up <ArrowRight className="size-4" />
                </Link>
                <div className="ml-1">
                  <ModeToggle />
                </div>
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  )
}

function NavbarWithoutClerk() {
  return (
    <nav className="sticky z-50 h-16 inset-x-0 top-0 w-full border-b border-gray-200 bg-white/80 backdrop-blur-lg transition-all dark:bg-dark-background dark:bg-dark-background/80 dark:backdrop-blur-lg dark:transition-all dark:border-gray-700">
      <MaxWidthWrapper>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex z-40 font-semibold dark:text-zinc-300">
            Ping<span className="text-brand-700 dark:text-brand-600">Flow</span>
          </Link>

          <div className="h-full flex items-center space-x-4 dark:text-zinc-300">
            <Link
              href="/pricing"
              className={buttonVariants({
                size: "sm",
                variant: "ghost",
              })}
            >
              Pricing
            </Link>
            <Link
              href="/sign-in"
              className={buttonVariants({
                size: "sm",
                variant: "ghost",
              })}
            >
              Sign in
            </Link>

            <div className="h-8 w-px bg-gray-200" />

            <Link
              href="/sign-up"
              className={buttonVariants({
                size: "sm",
                className: "flex items-center gap-1.5",
              })}
            >
              Sign up <ArrowRight className="size-4" />
            </Link>
            <div className="ml-1">
              <ModeToggle />
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  )
}

export const Navbar = () => {
  // During static generation without Clerk, use the version without Clerk hooks
  if (!isClerkAvailable()) {
    return <NavbarWithoutClerk />
  }
  
  // When Clerk is available, use the version with Clerk hooks
  return <NavbarWithClerk />
}
