"use client";

import React from "react";
import { Toaster } from "@/components/ui/sonner";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import NavTop from "@/components/sidebar/nav-top";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="fixed top-0 left-0 right-0 z-30">
        <NavTop />
      </div>
      <AppSidebar className="pt-16" />
      <SidebarInset>
        <div className="pt-16 px-2 sm:px-4 md:px-8 lg:px-12 min-h-screen bg-accent">
          {children}
        </div>
      </SidebarInset>
      <Toaster
        position="top-right"
        visibleToasts={3}
        expand={true}
        richColors
      />
    </SidebarProvider>
  );
}
