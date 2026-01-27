import { cn } from "@/utils"
import { Clock } from "lucide-react"
import Image from "next/image"

interface DiscordMessageProps {
  avatarSrc: string
  avatarAlt: string
  username: string
  timestamp: string
  badgeText?: string
  badgeColor?: string
  title: string
  content: {
    [key: string]: string
  }
}

type BadgeColor = "#43b581" | "#faa61a" | (string & {})

const getBadgeStyles = (color: BadgeColor) => {
  switch (color) {
    case "#43b581":
      return "bg-green-500/10 text-green-400 ring-green-500/20"
    case "#faa61a":
      return "bg-yellow-500/10 text-yellow-400 ring-yellow-500/20"
    default:
      return "bg-gray-500/10 text-gray-400 ring-gray-500/20"
  }
}

export const DiscordMessage = ({
  avatarAlt,
  avatarSrc,
  content,
  timestamp,
  title,
  username,
  badgeColor = "#43b581",
  badgeText,
}: DiscordMessageProps) => {
  return (
    <div className="w-full flex items-start justify-start">
      <div className="flex items-center mb-2">
        <Image
          src={avatarSrc}
          alt={avatarAlt}
          width={40}
          height={40}
          className="object-cover rounded-md border-2 border-black mr-3 dark:border-white/20"
        />
      </div>

      <div className="w-full max-w-xl">
        <div className="flex items-center">
          <p className="font-semibold text-white font-excon">{username}</p>
          <span className="ml-2 px-1.5 py-0.5 text-xs font-semibold bg-brand-600 text-white rounded-md border-2 border-black shadow-[2px_2px_0px_0px_#000] font-excon dark:border-white/20 dark:shadow-[2px_2px_0px_0px_#757373]">
            APP
          </span>
          <span className="text-gray-400 ml-1.5 text-xs font-normal">
            {timestamp}
          </span>
        </div>

        <div className="bg-[#2f3136] text-sm w-full rounded-md border-2 border-black p-3 mb-4 mt-1.5 shadow-[2px_2px_0px_0px_#000] dark:border-white/20 dark:shadow-[2px_2px_0px_0px_#757373]">
          <div className="flex flex-row items-center justify-between mb-2">
            {badgeText ? (
              <span
                className={cn(
                  "inline-flex order-2 items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset font-excon",
                  getBadgeStyles(badgeColor)
                )}
              >
                {badgeText}
              </span>
            ) : null}
            <p className="text-white order-1 text-base/7 font-semibold font-excon">
              {title}
            </p>
          </div>

          {Object.entries(content).map(([key, value]) => (
            <p key={key} className="text-[#dcddde] text-sm/6 font-satoshi">
              <span className="text-[#b9bbbe] font-excon">{key}:</span> {value}
            </p>
          ))}

          <p className="text-[#72767d] text-xs mt-2 flex items-center font-satoshi">
            <Clock className="size-3 mr-1" />
            {timestamp}
          </p>
        </div>
      </div>
    </div>
  )
}
