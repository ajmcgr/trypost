import {
  Calendar,
  Layers,
  FileEdit,
  Clock,
  CheckCircle2,
  FileCheck,
  Users,
  Settings,
  FileStack,
  Link2,
  HelpCircle,
  ListOrdered,
  PanelLeft,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import postLogo from "@/assets/post-logo.png";
import { cn } from "@/lib/utils";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";


const mainItems = [
  { title: "New post", url: "/dashboard", icon: FileEdit },
  { title: "Bulk post", url: "/dashboard/bulk-tools", icon: Layers },
  { title: "Calendar", url: "/dashboard/calendar", icon: Calendar },
  { title: "Queue", url: "/dashboard/queue", icon: ListOrdered },
  { title: "All posts", url: "/dashboard/posts", icon: FileStack },
  { title: "Scheduled", url: "/dashboard/scheduled", icon: Clock },
  { title: "Posted", url: "/dashboard/posted", icon: CheckCircle2 },
  { title: "Drafts", url: "/dashboard/drafts", icon: FileCheck },
  { title: "Teams", url: "/dashboard/teams", icon: Users },
  { title: "Social Platforms", url: "/dashboard/connections", icon: Link2 },
];

const footerItems = [
  { title: "Settings", url: "/dashboard/account/settings", icon: Settings },
  { title: "Help", url: "/dashboard/account/support", icon: HelpCircle },
];

const itemClasses =
  "h-10 rounded-xl px-4 gap-3 text-sm font-medium text-foreground/70 hover:bg-muted hover:text-foreground data-[active=true]:bg-foreground data-[active=true]:text-background data-[active=true]:font-semibold [&>svg]:!size-[18px]";

const ctaItemClasses =
  "h-10 rounded-xl px-4 gap-3 text-sm font-semibold bg-brand-blue text-brand-blue-foreground hover:bg-brand-blue/90 shadow-sm [&>svg]:!size-[18px]";

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";
  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar className={cn(collapsed ? "w-20" : "w-64", "border-r-0")} collapsible="icon">
      <SidebarHeader className="px-4 pt-4 pb-2 border-b">
        <NavLink to="/dashboard" className="flex items-center">
          <img src={postLogo} alt="Post" className="h-6 w-auto object-contain" />
        </NavLink>
      </SidebarHeader>
      <div className="flex-1 flex flex-col border-r">
        <SidebarContent className="gap-0">
          <SidebarMenu className="px-3 gap-1 pt-2">
            <SidebarMenuItem>
              <SidebarMenuButton onClick={toggleSidebar} className={itemClasses}>
                <PanelLeft />
                {!collapsed && <span className="text-xs">Collapse</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>

            {mainItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive(item.url)}
                  className={item.title === "New post" ? ctaItemClasses : itemClasses}
                >
                  <NavLink to={item.url}>
                    <item.icon />
                    {!collapsed && <span>{item.title}</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="pb-4">
          <SidebarMenu className="px-3 gap-1">
            {footerItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={isActive(item.url)} className={itemClasses}>
                  <NavLink to={item.url}>
                    <item.icon />
                    {!collapsed && <span>{item.title}</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarFooter>
      </div>
    </Sidebar>
  );
}
