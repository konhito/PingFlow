"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { client } from "@/lib/client"
import { useMutation } from "@tanstack/react-query"
import Link from "next/link"
import { useState } from "react"

export const AccountSettings = ({
  discordId: initialDiscordId,
  whatsappId: initialWhatsappId,
  telegramId: initialTelegramId,
  notificationEmail: initialNotificationEmail,
}: {
  discordId: string
  whatsappId?: string
  telegramId?: string
  notificationEmail?: string
}) => {
  const [discordId, setDiscordId] = useState(initialDiscordId)
  const [whatsappId, setWhatsappId] = useState(initialWhatsappId || "")
  const [telegramId, setTelegramId] = useState(initialTelegramId || "")
  const [notificationEmail, setNotificationEmail] = useState(initialNotificationEmail || "")

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: {
      discordId?: string
      whatsappId?: string
      telegramId?: string
      notificationEmail?: string
    }) => {
      const res = await client.project.updateNotificationSettings.$post(data)
      return await res.json()
    },
    onSuccess: () => {
      // Optionally show a success message
    },
  })

  const handleSave = () => {
    mutate({
      discordId: discordId || undefined,
      whatsappId: whatsappId || undefined,
      telegramId: telegramId || undefined,
      notificationEmail: notificationEmail || undefined,
    })
  }

  return (
    <Card className="max-w-xl w-full space-y-6 bg-white dark:bg-[#202225] ring-1 ring-gray-200 dark:ring-gray-600">
      <div className="pt-2">
        <Label className="text-gray-900 dark:text-zinc-300">Discord ID</Label>
        <Input
          className="mt-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-zinc-300 border-gray-200 dark:border-gray-600"
          value={discordId}
          onChange={(e) => setDiscordId(e.target.value)}
          placeholder="Enter your Discord ID"
        />
        <p className="mt-2 text-sm/6 text-gray-600 dark:text-zinc-400">
          Don't know how to find your Discord ID?{" "}
          <Link href="#" className="text-brand-600 dark:text-brand-500 hover:text-brand-700 dark:hover:text-brand-400">
            Learn how to obtain it here
          </Link>
          .
        </p>
      </div>

      <div className="pt-2">
        <Label className="text-gray-900 dark:text-zinc-300">WhatsApp Number</Label>
        <Input
          className="mt-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-zinc-300 border-gray-200 dark:border-gray-600"
          value={whatsappId}
          onChange={(e) => setWhatsappId(e.target.value)}
          placeholder="Enter your WhatsApp number (e.g., +1234567890)"
          type="tel"
        />
        <p className="mt-2 text-sm/6 text-gray-600 dark:text-zinc-400">
          Include country code (e.g., +1 for US, +91 for India)
        </p>
      </div>

      <div className="pt-2">
        <Label className="text-gray-900 dark:text-zinc-300">Telegram ID</Label>
        <Input
          className="mt-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-zinc-300 border-gray-200 dark:border-gray-600"
          value={telegramId}
          onChange={(e) => setTelegramId(e.target.value)}
          placeholder="Enter your Telegram ID or username"
        />
        <p className="mt-2 text-sm/6 text-gray-600 dark:text-zinc-400">
          Your Telegram user ID or username (e.g., @username or 123456789)
        </p>
      </div>

      <div className="pt-2">
        <Label className="text-gray-900 dark:text-zinc-300">Notification Email</Label>
        <Input
          className="mt-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-zinc-300 border-gray-200 dark:border-gray-600"
          value={notificationEmail}
          onChange={(e) => setNotificationEmail(e.target.value)}
          placeholder="Enter email for notifications"
          type="email"
        />
        <p className="mt-2 text-sm/6 text-gray-600 dark:text-zinc-400">
          Email address to receive event notifications
        </p>
      </div>

      <div className="pt-4">
        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </Card>
  )
}
