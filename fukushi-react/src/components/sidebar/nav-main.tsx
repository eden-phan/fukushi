"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"

import Image from "next/image"

export function NavMain({
  items,
  pathname,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon | string
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
  pathname: string
}) {
  return (
      <SidebarGroup>
          <SidebarMenu>
              {items.map((item) => {
                  if (item.items && item.items.length > 0) {
                      return (
                          <Collapsible
                              key={item.title}
                              asChild
                              defaultOpen={item.isActive}
                              className="group/collapsible"
                          >
                              <SidebarMenuItem>
                                  <CollapsibleTrigger asChild>
                                      <SidebarMenuButton tooltip={item.title}>
                                          <span className="flex items-center w-full">
                                              {typeof item.icon === "string" ? (
                                                  <Image src={item.icon} alt="icon" width={15} height={15} />
                                              ) : (
                                                  item.icon && <item.icon />
                                              )}
                                              <span className="ml-2">{item.title}</span>
                                              {item.items && (
                                                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                              )}
                                          </span>
                                      </SidebarMenuButton>
                                  </CollapsibleTrigger>
                                  <CollapsibleContent>
                                      <SidebarMenuSub>
                                          {item.items?.map((subItem) => {
                                              const isSubActive =
                                                  pathname === "/" ? false : pathname.startsWith(subItem.url)
                                              return (
                                                  <SidebarMenuSubItem key={subItem.title}>
                                                      <SidebarMenuSubButton asChild isActive={isSubActive}>
                                                          <a href={subItem.url}>
                                                              <span>{subItem.title}</span>
                                                          </a>
                                                      </SidebarMenuSubButton>
                                                  </SidebarMenuSubItem>
                                              )
                                          })}
                                      </SidebarMenuSub>
                                  </CollapsibleContent>
                              </SidebarMenuItem>
                          </Collapsible>
                      )
                  } else {
                      const isActive = pathname === "/" ? item.url === "/" : pathname === item.url
                      return (
                          <SidebarMenuItem key={item.title}>
                              <SidebarMenuButton asChild tooltip={item.title} isActive={isActive}>
                                  <a href={item.url} className="flex items-center w-full">
                                      {typeof item.icon === "string" ? (
                                          <Image src={item.icon} alt="icon" width={15} height={15} />
                                      ) : (
                                          item.icon && <item.icon />
                                      )}
                                      <span className="ml-2">{item.title}</span>
                                  </a>
                              </SidebarMenuButton>
                          </SidebarMenuItem>
                      )
                  }
              })}
          </SidebarMenu>
      </SidebarGroup>
  )
}
