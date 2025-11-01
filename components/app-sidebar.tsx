"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  Home,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
  BarChart3,
  Plus,
  ChevronDown,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { useSession } from "next-auth/react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const defaultData = {
  navMain: [
    // Home section
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
      isActive: true,
    },
    {
      title: "Projects",
      url: "#",
      icon: Frame,
      isActive: false,
      items: [
        {
          title: "Design Engineering",
          url: "#",
          badge: "More",
        },
        {
          title: "Sales & Marketing",
          url: "#",
          badge: "More",
        },
        {
          title: "Travel",
          url: "#",
          badge: "More",
        }
      ]
    },
    {
      title: "Analytics",
      url: "#",
      icon: BarChart3,
      isActive: false,
      items: [
        {
          title: "Overview",
          url: "#",
        },
        {
          title: "Reports",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        }
      ]
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      isActive: false,
      items: [
        {
          title: "Getting Started",
          url: "#",
        },
        {
          title: "API Reference",
          url: "#",
        },
        {
          title: "Guides",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      isActive: false,
      items: [
        {
          title: "Account",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Preferences",
          url: "#",
        },
      ],
    },
    //     {
    //       title: "Settings",
    //       url: "#",
    //     },
    //   ],
    // },
    // Models section (commented out old version)
    // {
    //   title: "Models",
    //   url: "#",
    //   icon: Bot,
    //   items: [
    //     {
    //       title: "Genesis",
    //       url: "#",
    //     },
    //     {
    //       title: "Explorer",
    //       url: "#",
    //     },
    //     {
    //       title: "Quantum",
    //       url: "#",
    //     },
    //   ],
    // },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
      more: true,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
      more: true,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
      more: true,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = React.useState(false);
  const isAuthenticated = status === "authenticated";

  // Set mounted state after component mounts
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Debug logging
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('AppSidebar - Status:', status);
      console.log('AppSidebar - Session:', session);
    }
  }, [status, session]);

  // Safely access user data
  const user = {
    name: session?.user?.name || (session as any)?.name || "User",
    email: session?.user?.email || (session as any)?.email || "user@example.com",
    avatar: session?.user?.image || (session as any)?.image || "/avatars/orian.jpg",
  };

  if (!mounted) {
    return null;
  }

  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            {/* <SidebarMenuButton asChild size="lg">
              <Link
                href={isAuthenticated ? "/dashboard" : "/"}
                className="flex items-center gap-2 w-full"
              >
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <span className="inline-block font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  OrienAI
                </span>
              </Link>
            </SidebarMenuButton> */}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="h-full">
          <div className="space-y-1">
            <NavMain items={defaultData.navMain} />
            <div className="px-4 py-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-muted-foreground">PROJECTS</span>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
              <NavProjects projects={defaultData.projects} />
            </div>
            <NavSecondary items={defaultData.navSecondary} className="mt-auto" />
          </div>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}