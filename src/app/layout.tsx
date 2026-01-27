import type { Metadata, Viewport } from "next"
import { Providers } from "@/components/providers"
import { cn } from "@/utils"

import "./globals.css"
import { ClerkProvider } from "@clerk/nextjs"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_WEBSITE_URL || "https://pingflow.com"),
  title: {
    default: "PingFlow - Real-Time SaaS Event Notifications",
    template: "%s | PingFlow"
  },
  description: "Real-time SaaS event notifications delivered to Discord, WhatsApp, and Telegram. Track sales, signups, and custom events instantly.",
  keywords: ["saas notifications", "discord integration", "whatsapp alerts", "telegram messages", "event monitoring"],
  authors: [{ name: "Konhito aka Aditya" }],
  creator: "Konhito aka Aditya",
  publisher: "PingFlow",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: [
    { rel: "icon", url: "/brand-asset-profile-picture.png" },
    { rel: "apple-touch-icon", url: "/brand-asset-profile-picture.png" },
  ],
  manifest: "/manifest.json",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0f14" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  // Check if we have a valid Clerk key (must start with pk_test_ or pk_live_)
  const hasValidKey = clerkPublishableKey && (
    clerkPublishableKey.startsWith('pk_test_') || 
    clerkPublishableKey.startsWith('pk_live_')
  )
  
  const htmlContent = (
    <html lang="en" className="font-satoshi">
      <body className="min-h-[calc(100vh-1px)] flex flex-col font-satoshi bg-background dark:bg-background text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <main className="relative flex-1 flex flex-col">
            <Providers>{children}</Providers>
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
  
  // Only wrap with ClerkProvider if we have a valid key
  // Pages that need Clerk should be marked as dynamic and will have the key at runtime
  if (!hasValidKey) {
    return htmlContent
  }
  
  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      {htmlContent}
    </ClerkProvider>
  )
}
