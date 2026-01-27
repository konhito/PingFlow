"use client"

import { useEffect } from "react"

/**
 * © 2024-2026 PingFlow. All rights reserved.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * 
 * This component implements basic client-side protection measures.
 * Note: These can be bypassed by determined users but serve as deterrents.
 */
export const Protection = () => {
  useEffect(() => {
    // Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      return false
    }

    // Disable common keyboard shortcuts for viewing source
    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C")) ||
        (e.ctrlKey && e.key === "u")
      ) {
        e.preventDefault()
        return false
      }
    }

    // Add watermark in console
    console.log(
      "%c⚠️ PingFlow - Copyright Protected",
      "color: #ef4444; font-size: 24px; font-weight: bold;"
    )
    console.log(
      "%c© 2024-2026 PingFlow. All rights reserved.\nUnauthorized copying, modification, or distribution of this code is strictly prohibited.\n\nIf you're interested in licensing, contact us at: contact@pingflow.com",
      "color: #6b7280; font-size: 14px;"
    )

    // Add invisible watermark to DOM
    const watermark = document.createElement("div")
    watermark.style.display = "none"
    watermark.setAttribute("data-copyright", "PingFlow-2024-All-Rights-Reserved")
    watermark.setAttribute("data-owner", "Konhito-aka-Aditya")
    watermark.textContent = `© ${new Date().getFullYear()} PingFlow. Unauthorized use prohibited.`
    document.body.appendChild(watermark)

    document.addEventListener("contextmenu", handleContextMenu)
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu)
      document.removeEventListener("keydown", handleKeyDown)
      if (watermark.parentNode) {
        watermark.parentNode.removeChild(watermark)
      }
    }
  }, [])

  return null
}

