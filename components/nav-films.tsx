"use client"

import Link from "next/link"
import { type LucideIcon } from "lucide-react"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar"

export function NavFilms({
  items,
}: {
  items: {
    title: string    
    icon?: LucideIcon
    url: string
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col">
        <SidebarGroupLabel>Films</SidebarGroupLabel>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title} asChild>
                <Link href={item.url}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>                
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
