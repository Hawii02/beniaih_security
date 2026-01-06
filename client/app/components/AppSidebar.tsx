import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  //   DropdownMenu,
} from "@/components/ui/sidebar";
import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  User2,
  ChevronUp,
  MessageCircle,
  MessageCircleQuestionMark,
} from "lucide-react";

export function AppSidebar() {
  // menu items
  const items = [
    { label: "Home", icon: Home, href: "/dashboard" },
    { label: "Search", icon: Search, href: "/dashboard/search" },
    { label: "Calendar", icon: Calendar, href: "/dashboard/calendar" },
    { label: "Inbox", icon: Inbox, href: "/dashboard/inbox" },
    { label: "Settings", icon: Settings, href: "/dashboard/settings" },
  ];

  const supportItems = [
    { label: "Feedback", icon: MessageCircle, href: "/dashboard/feedback" },
    {
      label: "Support",
      icon: MessageCircleQuestionMark,
      href: "/dashboard/support",
    },
  ];
  return (
    <Sidebar collapsible="icon" variant="inset" className="border-r border-slate-300">
      {/* SIDEBAR HEADER */}
      <SidebarHeader/>
        {/* <SidebarTrigger /> */}
      {/* </SidebarHeader> */}
      {/* SIDEBAR CONTENT */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase font-semibold">
            Application
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item, i) => (
                <SidebarMenuItem key={i}>
                  <SidebarMenuButton asChild>
                    <a href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {/* HELP AND SUPPORT */}
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase font-semibold">
            help and support
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {supportItems.map((item, i) => (
                <SidebarMenuItem key={i}>
                  <SidebarMenuButton asChild>
                    <a href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {/* SIDEBAR FOOTER */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> Username
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
