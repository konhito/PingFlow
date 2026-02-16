"use client"

import { useState, useEffect, createContext, useContext, ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
    id: string
    email: string
    name?: string
    avatar?: string
}

interface AuthContextType {
    user: User | null
    loading: boolean
    signIn: (credentials: any) => Promise<void>
    signUp: (data: any) => Promise<void>
    signOut: () => Promise<void>
    refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    const fetchUser = async () => {
        try {
            const res = await fetch("/api/auth/me")
            if (res.ok) {
                const data = await res.json()
                setUser(data)
            } else {
                setUser(null)
            }
        } catch (error) {
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUser()
    }, [])

    const signIn = async (credentials: any) => {
        const res = await fetch("/api/auth/sign-in", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
        })

        if (!res.ok) {
            const error = await res.json()
            throw new Error(error.message || "Failed to sign in")
        }

        await fetchUser()
        router.refresh()
    }

    const signUp = async (data: any) => {
        const res = await fetch("/api/auth/sign-up", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        })

        if (!res.ok) {
            const error = await res.json()
            throw new Error(error.message || "Failed to sign up")
        }

        await fetchUser()
        router.refresh()
    }

    const signOut = async () => {
        await fetch("/api/auth/sign-out", { method: "POST" })
        setUser(null)
        router.push("/")
        router.refresh()
    }

    const refreshUser = async () => {
        await fetchUser()
    }

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, refreshUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
