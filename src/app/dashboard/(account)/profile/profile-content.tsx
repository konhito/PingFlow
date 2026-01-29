"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { User } from "@clerk/nextjs/server"
import { User as DbUser } from "@prisma/client"
import { useUser, UserProfile } from "@clerk/nextjs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail, Calendar, Key, User as UserIcon, Camera, Save, X } from "lucide-react"
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"

interface ProfileContentProps {
  clerkUser: User
  dbUser: DbUser
}

export const ProfileContent = ({ clerkUser, dbUser }: ProfileContentProps) => {
  const { user, isLoaded } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [username, setUsername] = useState("")

  if (!isLoaded || !user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600 dark:text-zinc-400">Loading profile...</p>
      </div>
    )
  }

  // Initialize form values when entering edit mode
  const handleEditClick = () => {
    setFirstName(user.firstName || "")
    setLastName(user.lastName || "")
    setUsername(user.username || "")
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setFirstName(user.firstName || "")
    setLastName(user.lastName || "")
    setUsername(user.username || "")
  }

  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: async () => {
      if (!user) return
      
      // Update user profile using Clerk
      await user.update({
        firstName: firstName.trim() || undefined,
        lastName: lastName.trim() || undefined,
        username: username.trim() || undefined,
      })
    },
    onSuccess: () => {
      setIsEditing(false)
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
              <AvatarImage src={user.imageUrl} alt={user.fullName || "User"} />
              <AvatarFallback className="text-3xl bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-400">
                {user.firstName?.charAt(0) || user.emailAddresses[0]?.emailAddress?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <UserProfile mode="modal">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 w-10 rounded-full p-0 text-white hover:bg-white/20"
                  asChild
                >
                  <button>
                    <Camera className="h-5 w-5" />
                  </button>
                </Button>
              </UserProfile>
            </div>
          </div>

          <div className="flex-1 w-full">
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-900 dark:text-zinc-300">First Name</Label>
                    <Input
                      className="mt-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-zinc-300 border-gray-200 dark:border-gray-600"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First Name"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-900 dark:text-zinc-300">Last Name</Label>
                    <Input
                      className="mt-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-zinc-300 border-gray-200 dark:border-gray-600"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last Name"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-gray-900 dark:text-zinc-300">Username</Label>
                  <Input
                    className="mt-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-zinc-300 border-gray-200 dark:border-gray-600"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="username"
                  />
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
                  {user.fullName || "User"}
                </h2>
                <p className="text-gray-600 dark:text-zinc-400 mt-1">
                  {user.emailAddresses[0]?.emailAddress || "No email"}
                </p>
                {user.username && (
                  <p className="text-sm text-gray-500 dark:text-zinc-500 mt-1">
                    @{user.username}
                  </p>
                )}
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
              <Label className="text-gray-700 dark:text-zinc-400">First Name</Label>
              <div className="mt-1 text-gray-900 dark:text-zinc-300 font-medium">
                {user.firstName || "Not set"}
              </div>
            </div>
            <div>
              <Label className="text-gray-700 dark:text-zinc-400">Last Name</Label>
              <div className="mt-1 text-gray-900 dark:text-zinc-300 font-medium">
                {user.lastName || "Not set"}
              </div>
            </div>
            <div>
              <Label className="text-gray-700 dark:text-zinc-400">Username</Label>
              <div className="mt-1 text-gray-900 dark:text-zinc-300 font-medium">
                {user.username ? `@${user.username}` : "Not set"}
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
                {user.emailAddresses[0]?.emailAddress || "No email"}
              </div>
              {user.emailAddresses[0]?.verification?.status === "verified" && (
                <span className="inline-block mt-1 text-xs text-green-600 dark:text-green-400 font-medium">
                  ✓ Verified
                </span>
              )}
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
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                dbUser.plan === "PRO"
                  ? "bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-400"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
              }`}>
                {dbUser.plan}
              </span>
            </div>
          </div>
          <div>
            <Label className="text-gray-700 dark:text-zinc-400">User ID</Label>
            <div className="mt-1 text-gray-900 dark:text-zinc-300 font-mono text-sm break-all">
              {dbUser.id}
            </div>
          </div>
        </div>
      </Card>

      {/* Profile Picture Update Note */}
      <Card className="bg-white dark:bg-[#202225] ring-1 ring-gray-200 dark:ring-gray-600 p-6">
        <div className="flex items-start gap-4">
          <Camera className="h-5 w-5 text-brand-600 dark:text-brand-500 mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-zinc-300 mb-2">
              Update Profile Picture
            </h3>
            <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4">
              Click on your profile picture above to update it. You can upload a new image or choose from your existing photos.
            </p>
            <UserProfile mode="modal">
              <Button 
                variant="outline" 
                className="bg-white hover:bg-gray-50 dark:bg-[#202225] dark:hover:bg-gray-800 dark:text-zinc-300"
                asChild
              >
                <button>Change Profile Picture</button>
              </Button>
            </UserProfile>
          </div>
        </div>
      </Card>

    </div>
  )
}

