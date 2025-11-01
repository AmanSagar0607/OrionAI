"use client";

import Link from "next/link";
import { SidebarIcon } from "lucide-react";
import { SearchForm } from "@/components/search-form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-(--header-height) w-full items-center justify-between px-4">
        {/* Left - Sidebar toggle + Logo */}
        <div className="flex items-center gap-2">
          <Button
            className="h-8 w-8"
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
          >
            <SidebarIcon />
          </Button>

          {/* Vertical bar */}
          <Separator orientation="vertical" className="h-6" />

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              OrienAI
            </span>
          </Link>
        </div>

        {/* Right - Search + Auth */}
        <div className="flex items-center gap-4">
          <SearchForm className="w-[300px]" />
          {/* <AuthButton /> */}
        </div>
      </div>
    </header>
  );
}