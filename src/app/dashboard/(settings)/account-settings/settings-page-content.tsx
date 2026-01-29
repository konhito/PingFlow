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
}: {
  discordId: string
}) => {
  const [discordId, setDiscordId] = useState(initialDiscordId)

  const { mutate, isPending } = useMutation({
    mutationFn: async (discordId: string) => {
      const res = await client.project.setDiscordID.$post({ discordId })
      return await res.json()
    },
  })

  return (
    <Card className="max-w-xl w-full space-y-4 bg-white dark:bg-[#202225] ring-1 ring-gray-200 dark:ring-gray-600">
      <div className="pt-2">
        <Label className="text-gray-900 dark:text-zinc-300">Discord ID</Label>
        <Input
          className="mt-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-zinc-300 border-gray-200 dark:border-gray-600"
          value={discordId}
          onChange={(e) => setDiscordId(e.target.value)}
          placeholder="Enter your Discord ID"
        />
      </div>

      <p className="mt-2 text-sm/6 text-gray-600 dark:text-zinc-400">
        Don't know how to find your Discord ID?{" "}
        <Link href="#" className="text-brand-600 dark:text-brand-500 hover:text-brand-700 dark:hover:text-brand-400">
          Learn how to obtain it here
        </Link>
        .
      </p>

      <div className="pt-4">
        <Button onClick={() => mutate(discordId)} disabled={isPending}>
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </Card>
  )
}
