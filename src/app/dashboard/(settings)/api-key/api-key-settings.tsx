"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckIcon, ClipboardIcon } from "lucide-react"
import { useState } from "react"

export const ApiKeySettings = ({ apiKey }: { apiKey: string }) => {
  const [copySuccess, setCopySuccess] = useState(false)

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  return (
    <Card className="max-w-xl w-full bg-white dark:bg-[#202225] ring-1 ring-gray-200 dark:ring-gray-600">
      <div>
        <Label className="text-gray-900 dark:text-zinc-300">Your API Key</Label>
        <div className="mt-1 relative">
          <Input 
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-zinc-300 border-gray-200 dark:border-gray-600" 
            type="password" 
            value={apiKey} 
            readOnly 
          />
          <div className="absolute space-x-0.5 inset-y-0 right-0 flex items-center">
            <Button
              variant="outline"
              onClick={copyApiKey}
              className="p-1 w-10 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:outline-none dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-zinc-300 dark:focus:ring-2 dark:focus:ring-brand-500"
            >
              {copySuccess ? (
                <CheckIcon className="size-4 text-brand-600 dark:text-brand-500" />
              ) : (
                <ClipboardIcon className="size-4 text-brand-600 dark:text-brand-500" />
              )}
            </Button>
          </div>
        </div>

        <p className="mt-2 text-sm/6 text-gray-600 dark:text-zinc-400">
          Keep your key secret and do not share it with others.
        </p>
      </div>
    </Card>
  )
}
