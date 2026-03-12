"use client"

import { LoadingSpinner } from "@/components/loading-spinner"
import { Button, buttonVariants } from "@/components/ui/button"
import { client } from "@/lib/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { format, formatDistanceToNow } from "date-fns"
import {
  Activity,
  ArrowRight,
  Bell,
  Database,
  MoreVertical,
  Trash2,
  TrendingUp,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { DashboardEmptyState } from "./dashboard-empty-state"
import { Modal } from "@/components/ui/model"

export const DashboardPageContent = () => {
  const [deletingCategory, setDeletingCategory] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const { data: categories, isPending: isEventCategoriesLoading } = useQuery({
    queryKey: ["user-event-categories"],
    queryFn: async () => {
      const res = await client.category.getEventCategories.$get()
      const { categories } = await res.json()
      return categories
    },
  })

  const { mutate: deleteCategory, isPending: isDeletingCategory } = useMutation(
    {
      mutationFn: async (name: string) => {
        await client.category.deleteCategory.$post({ name })
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["user-event-categories"] })
        setDeletingCategory(null)
      },
    }
  )

  if (isEventCategoriesLoading) {
    return (
      <div className="flex items-center justify-center flex-1 h-full w-full">
        <LoadingSpinner />
      </div>
    )
  }

  if (!categories || categories.length === 0) {
    return <DashboardEmptyState />
  }

  // Summary stats across all categories
  const totalEvents = categories.reduce(
    (sum, c) => sum + (c.eventsCount || 0),
    0
  )
  const totalFields = categories.reduce(
    (sum, c) => sum + (c.uniqueFieldCount || 0),
    0
  )
  const activeSince = categories.reduce(
    (earliest, c) =>
      new Date(c.createdAt) < new Date(earliest) ? c.createdAt : earliest,
    categories[0].createdAt
  )

  return (
    <>
      {/* ── Summary bar ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-[#202225] rounded-xl ring-1 ring-gray-200 dark:ring-gray-700 p-4 flex items-center gap-3">
          <div className="size-10 rounded-lg bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center shrink-0">
            <Bell className="size-5 text-brand-600 dark:text-brand-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-zinc-400 font-medium uppercase tracking-wide">Categories</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-zinc-100">{categories.length}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#202225] rounded-xl ring-1 ring-gray-200 dark:ring-gray-700 p-4 flex items-center gap-3">
          <div className="size-10 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center shrink-0">
            <TrendingUp className="size-5 text-green-600 dark:text-green-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-zinc-400 font-medium uppercase tracking-wide">Events this month</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-zinc-100">{totalEvents.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#202225] rounded-xl ring-1 ring-gray-200 dark:ring-gray-700 p-4 flex items-center gap-3">
          <div className="size-10 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center shrink-0">
            <Database className="size-5 text-purple-600 dark:text-purple-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-zinc-400 font-medium uppercase tracking-wide">Tracked fields</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-zinc-100">{totalFields}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#202225] rounded-xl ring-1 ring-gray-200 dark:ring-gray-700 p-4 flex items-center gap-3">
          <div className="size-10 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center shrink-0">
            <Zap className="size-5 text-amber-600 dark:text-amber-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-zinc-400 font-medium uppercase tracking-wide">Active since</p>
            <p className="text-sm font-bold text-gray-900 dark:text-zinc-100">
              {format(new Date(activeSince), "MMM d, yyyy")}
            </p>
          </div>
        </div>
      </div>

      {/* ── Category grid ─────────────────────────────────────────── */}
      <ul className="grid max-w-6xl grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        {categories.map((category) => {
          const colorHex = category.color
            ? `#${category.color.toString(16).padStart(6, "0")}`
            : "#6366f1"

          const hasRecentActivity = category.lastPing
            ? new Date(category.lastPing).getTime() >
              Date.now() - 1000 * 60 * 60 * 24
            : false

          return (
            <li
              key={category.id}
              className="group relative"
            >
              <div className="relative h-full bg-white dark:bg-[#202225] rounded-2xl ring-1 ring-gray-200 dark:ring-gray-700 overflow-hidden transition-all duration-200 hover:ring-2 hover:ring-brand-400 dark:hover:ring-brand-600 hover:shadow-lg hover:-translate-y-0.5">
                {/* Colored top accent bar */}
                <div
                  className="h-1.5 w-full"
                  style={{ backgroundColor: colorHex }}
                />

                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="size-11 rounded-xl flex items-center justify-center text-xl shadow-sm"
                        style={{ backgroundColor: `${colorHex}20`, border: `1px solid ${colorHex}40` }}
                      >
                        {category.emoji || "📂"}
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-gray-900 dark:text-zinc-100 leading-tight">
                          {category.name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                          Created {format(new Date(category.createdAt), "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>

                    {/* Menu button */}
                    <div className="relative">
                      <button
                        onClick={() =>
                          setMenuOpen(
                            menuOpen === category.id ? null : category.id
                          )
                        }
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-zinc-300 transition-colors"
                      >
                        <MoreVertical className="size-4" />
                      </button>

                      {menuOpen === category.id && (
                        <div className="absolute right-0 top-8 z-20 bg-white dark:bg-[#2b2d31] rounded-xl shadow-xl ring-1 ring-gray-200 dark:ring-gray-700 min-w-[140px] py-1 overflow-hidden">
                          <button
                            className="w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            onClick={() => {
                              setMenuOpen(null)
                              setDeletingCategory(category.name)
                            }}
                          >
                            <Trash2 className="size-3.5" />
                            Delete category
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <TrendingUp className="size-3.5 text-brand-600 dark:text-brand-500" />
                        <span className="text-xs font-medium text-gray-500 dark:text-zinc-400">Events</span>
                      </div>
                      <p className="text-xl font-bold text-gray-900 dark:text-zinc-100">
                        {(category.eventsCount || 0).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-zinc-500">this month</p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Database className="size-3.5 text-purple-600 dark:text-purple-500" />
                        <span className="text-xs font-medium text-gray-500 dark:text-zinc-400">Fields</span>
                      </div>
                      <p className="text-xl font-bold text-gray-900 dark:text-zinc-100">
                        {category.uniqueFieldCount || 0}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-zinc-500">unique fields</p>
                    </div>
                  </div>

                  {/* Last activity */}
                  <div className="flex items-center gap-2 mb-4 py-2.5 px-3 rounded-xl bg-gray-50 dark:bg-gray-800/60">
                    <div
                      className={`size-2 rounded-full shrink-0 ${
                        hasRecentActivity
                          ? "bg-green-500 animate-pulse"
                          : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    />
                    <Activity className="size-3.5 text-gray-400 dark:text-zinc-500" />
                    <span className="text-xs text-gray-600 dark:text-zinc-400">
                      {category.lastPing
                        ? `Last ping ${formatDistanceToNow(new Date(category.lastPing))} ago`
                        : "No pings received yet"}
                    </span>
                  </div>

                  {/* CTA */}
                  <Link
                    href={`/dashboard/category/${category.name}`}
                    className={buttonVariants({
                      size: "sm",
                      className:
                        "w-full justify-center gap-2 text-sm font-medium",
                    })}
                    style={{ backgroundColor: colorHex, borderColor: colorHex }}
                    onClick={() => setMenuOpen(null)}
                  >
                    View events <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            </li>
          )
        })}
      </ul>

      {/* ── Delete confirmation modal ───────────────────────────────── */}
      <Modal
        showModal={!!deletingCategory}
        setShowModal={() => setDeletingCategory(null)}
        className="max-w-md p-8"
      >
        <div className="space-y-6">
          <div>
            <div className="size-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
              <Trash2 className="size-5 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-lg/7 font-semibold tracking-tight text-gray-900 dark:text-zinc-100">
              Delete &ldquo;{deletingCategory}&rdquo;?
            </h2>
            <p className="text-sm/6 text-gray-600 dark:text-zinc-400 mt-1">
              This will permanently delete the category and all associated
              events. This action cannot be undone.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={() => setDeletingCategory(null)}
              className="dark:bg-[#202225] dark:text-zinc-300 dark:hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                deletingCategory && deleteCategory(deletingCategory)
              }
              disabled={isDeletingCategory}
              className="gap-2"
            >
              <Trash2 className="size-4" />
              {isDeletingCategory ? "Deleting..." : "Delete category"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Close menu on outside click */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setMenuOpen(null)}
        />
      )}
    </>
  )
}
