import type { Metadata } from "next"
import { Providers } from "@/components/providers"
import { cn } from "@/utils"

import "./globals.css"
import { ClerkProvider } from "@clerk/nextjs"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: "PingFlow",
  description: "Real-time SaaS event notifications delivered to Discord, WhatsApp, and Telegram",
  icons: [{ rel: "icon", url: "/brand-asset-profile-picture.png" }],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="font-satoshi">
        <body className="min-h-[calc(100vh-1px)] flex flex-col font-satoshi bg-background dark:bg-background text-foreground antialiased">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <main className="relative flex-1 flex flex-col">
              <Providers>{children}</Providers>
            </main>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider >
  )
}
