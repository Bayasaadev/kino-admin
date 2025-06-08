"use client"

import * as React from "react"
import {
  IconCamera,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileWord,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSettings,
  IconUsers,  
} from "@tabler/icons-react"

import { NavFilms } from "@/components/nav-films"
import { NavUsers } from "@/components/nav-users"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuth } from "./providers/auth-provider"
import Link from "next/link"

const data = {
  navFilms: [
    {
      title: "Films",
      icon: IconCamera,
      url: "/films",
    },
    {
      title: "Genres",      
      icon: IconListDetails,
      url: "/genres",
    },
    {
      title: "Themes",
      icon: IconFileAi,
      url: "/themes",
    },
    {
      title: "Studios",
      icon: IconDatabase,
      url: "/studios",
    },
    {
      title: "Countries",
      icon: IconReport,
      url: "/countries",
    },
    {
      title: "Languages",
      icon: IconFileWord,
      url: "/languages",
    }    
  ],
  navUsers: [
    {
      title: "Users",
      url: "/users",
      icon: IconUsers,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "https://github.com/yourrepo",
      icon: IconHelp,
    },
  ],
  documents: [],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Kino +</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col">
            <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Dashboard" asChild>
                    <Link href="/">
                      <IconDashboard />
                      <span>Dashboard</span>
                    </Link>                
                  </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <NavFilms items={data.navFilms} />
        {user?.role === "admin" ? <NavUsers items={data.navUsers} /> : ""}        
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user ? {
          name: user.username,
          email: user.email,
          avatar: user.avatar || "",
        } : {
          name: "Loading...",
          email: "",
          avatar: "",
        }} />
      </SidebarFooter>
    </Sidebar>
  )
}
