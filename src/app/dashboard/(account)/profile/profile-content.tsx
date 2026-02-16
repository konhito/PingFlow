"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { User as DbUser } from "@prisma/client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail, Calendar, Key, User as UserIcon, Camera, Save, X } from "lucide-react"
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

interface ProfileContentProps {
  user: any
}

export const ProfileContent = ({ user }: ProfileContentProps) => {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  // Assuming name is split or just use name field. The schema has `name`.
  // Clerk had firstName/lastName. I will map `name` to a single field or handle splitting if schema has firstName/lastName (it doesn't, just `name` in my mental model of typical next-auth, but I should check schema).
  // Checking schema from previous steps: `name String?`
  const [name, setName] = useState(user.name || "")

  // Initialize form values when entering edit mode
  const handleEditClick = () => {
    setName(user.name || "")
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setName(user.name || "")
  }

  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })

      if (!res.ok) throw new Error("Failed to update profile")
      return res.json()
    },
    onSuccess: () => {
      setIsEditing(false)
      router.refresh()
    },
  })

  const handleSave = () => {
    updateProfile()
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Profile Header Card */}
      <Card className="bg-white dark:bg-[#202225] ring-1 ring-gray-200 dark:ring-gray-600 p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative group">
            <Avatar className="h-32 w-32 ring-4 ring-gray-200 dark:ring-gray-700">
              <AvatarImage src={user.avatar || ""} alt={user.name || "User"} />
              <AvatarFallback className="text-3xl bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-400">
                {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            {/* Image upload not implemented yet */}
          </div>

          <div className="flex-1 w-full">
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label className="text-gray-900 dark:text-zinc-300">Full Name</Label>
                    <Input
                      className="mt-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-zinc-300 border-gray-200 dark:border-gray-600"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full Name"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleSave}
                    disabled={isPending}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {isPending ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isPending}
                    className="bg-white hover:bg-gray-50 dark:bg-[#202225] dark:hover:bg-gray-800 dark:text-zinc-300"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-heading font-semibold text-gray-900 dark:text-zinc-300">
                  {user.name || "User"}
                </h2>
                <p className="text-gray-600 dark:text-zinc-400 mt-1">
                  {user.email || "No email"}
                </p>

                <div className="mt-4">
                  <Button
                    variant="outline"
                    onClick={handleEditClick}
                    className="bg-white hover:bg-gray-50 dark:bg-[#202225] dark:hover:bg-gray-800 dark:text-zinc-300"
                  >
                    <UserIcon className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Profile Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card className="bg-white dark:bg-[#202225] ring-1 ring-gray-200 dark:ring-gray-600 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-zinc-300 mb-4 flex items-center gap-2">
            <UserIcon className="h-5 w-5 text-brand-600 dark:text-brand-500" />
            Personal Information
          </h3>
          <div className="space-y-4">
            <div>
              <Label className="text-gray-700 dark:text-zinc-400">Full Name</Label>
              <div className="mt-1 text-gray-900 dark:text-zinc-300 font-medium">
                {user.name || "Not set"}
              </div>
            </div>
          </div>
        </Card>

        {/* Contact Information */}
        <Card className="bg-white dark:bg-[#202225] ring-1 ring-gray-200 dark:ring-gray-600 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-zinc-300 mb-4 flex items-center gap-2">
            <Mail className="h-5 w-5 text-brand-600 dark:text-brand-500" />
            Contact Information
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Mail className="h-4 w-4 text-gray-500 dark:text-zinc-400" />
                <Label className="text-gray-700 dark:text-zinc-400">Email</Label>
              </div>
              <div className="mt-1 text-gray-900 dark:text-zinc-300 font-medium">
                {user.email || "No email"}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-gray-500 dark:text-zinc-400" />
                <Label className="text-gray-700 dark:text-zinc-400">Member Since</Label>
              </div>
              <div className="mt-1 text-gray-900 dark:text-zinc-300 font-medium">
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Account Details */}
      <Card className="bg-white dark:bg-[#202225] ring-1 ring-gray-200 dark:ring-gray-600 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-zinc-300 mb-4 flex items-center gap-2">
          <Key className="h-5 w-5 text-brand-600 dark:text-brand-500" />
          Account Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Key className="h-4 w-4 text-gray-500 dark:text-zinc-400" />
              <Label className="text-gray-700 dark:text-zinc-400">Plan</Label>
            </div>
            <div className="mt-1">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${user.plan === "PRO"
                ? "bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-400"
                : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                }`}>
                {user.plan}
              </span>
            </div>
          </div>
          <div>
            <Label className="text-gray-700 dark:text-zinc-400">User ID</Label>
            <div className="mt-1 text-gray-900 dark:text-zinc-300 font-mono text-sm break-all">
              {user.id}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

