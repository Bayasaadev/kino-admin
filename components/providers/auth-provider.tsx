"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { fetchProfile } from "@/lib/api/auth"

type User = {
  id: number
  username: string
  email: string
  avatar?: string | null
  role: string
}

type AuthContextType = {
  user: User | null
  setUser: (user: User | null) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access") : null;

  if (!token) {
    setUser(null);
    return;
  }

  fetchProfile(token)
    .then((profile) => {
      setUser(profile);
    })
    .catch((err) => {
      setUser(null);
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      router.replace("/login");
    });
}, [router]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
