"use client"

import { ReactNode, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AuthProvider } from "@/components/providers/auth-provider"

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [hasToken, setHasToken] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("access")
    if (!token) {
      router.replace("/login")
      setLoading(false)
    } else {
      setHasToken(true)
      setLoading(false)
    }
  }, [router])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!hasToken) {
    return null
  }

  return (
    <AuthProvider>
      <div className="flex">
        <SidebarProvider
          style={{
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties}
        >
          <AppSidebar variant="inset" />
          <SidebarInset>
            <SiteHeader />
            <div className="flex flex-1 flex-col">
              <div className="@container/main flex flex-1 flex-col gap-2">
                {children}
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </AuthProvider>
  )
}
