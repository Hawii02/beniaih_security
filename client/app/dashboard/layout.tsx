import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "../components/AppSidebar";
import { DashboardHeader } from "./components/DashboardHeader";
import DashboardFooter from "./components/DashboardFooter";
export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar/>
      <main className="min-h-screen w-full">
      <DashboardHeader/>
        {children}
      <DashboardFooter/>
      </main>
    </SidebarProvider>
  );
}
