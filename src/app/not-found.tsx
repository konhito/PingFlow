import Link from "next/link"
import { Button } from "@/components/ui/button"

export const dynamic = "force-static"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
      <h1 className="font-excon text-6xl font-black">404</h1>
      <h2 className="font-excon text-2xl font-semibold">Page Not Found</h2>
      <p className="text-muted-foreground font-satoshi text-center max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link href="/">
        <Button className="neuro-button">
          Go Home
        </Button>
      </Link>
    </div>
  )
}

