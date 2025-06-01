import { ReactNode } from "react"
import { redirect } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { cookies } from "next/headers"
import { AuthProvider } from "@/components/providers/auth-provider"

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  // Check token (on the client)
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access")
    if (!token) {
      redirect("/login")
    }
  }
  
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
    <AuthProvider>
      <div className="flex">
        <SidebarProvider
          defaultOpen={defaultOpen}
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 72)",
              "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
          }
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
