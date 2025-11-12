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
  Wand2,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "./ui/button";
import postLogo from "@/assets/post-logo.png";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
  SidebarFooter,
} from "@/components/ui/sidebar";

const createItems = [
  { title: "New post", url: "/dashboard", icon: FileEdit },
  { title: "Studio", url: "/dashboard/studio", icon: Wand2 },
  { title: "Bulk tools", url: "/dashboard/bulk-tools", icon: Layers },
];

const postsItems = [
  { title: "Calendar", url: "/dashboard/calendar", icon: Calendar },
  { title: "All", url: "/dashboard/posts", icon: FileStack },
  { title: "Scheduled", url: "/dashboard/scheduled", icon: Clock },
  { title: "Posted", url: "/dashboard/posted", icon: CheckCircle2 },
  { title: "Drafts", url: "/dashboard/drafts", icon: FileCheck },
];

const workspaceItems = [
  { title: "Teams", url: "/dashboard/teams", icon: Users },
];

const configItems = [
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
  { title: "Social Platforms", url: "/dashboard/connections", icon: Link2 },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { user } = useAuth();
  const currentPath = location.pathname;
  
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent>
        {/* Logo */}
        <div className="p-3">
          <NavLink to="/dashboard" className="flex">
            <img src={postLogo} alt="Post" className={collapsed ? "h-6" : "h-7"} />
          </NavLink>
        </div>

        {/* Create Post Button */}
        <div className="px-3 pb-3">
          <NavLink to="/dashboard">
            <Button className="w-full rounded-xl">
              {!collapsed && (
                <>
                  <FileEdit className="mr-2 h-4 w-4" />
                  Create post
                </>
              )}
              {collapsed && <FileEdit className="h-4 w-4" />}
            </Button>
          </NavLink>
        </div>

        {/* Create Section */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>Create</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {createItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} className="hover:bg-muted/50">
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Posts Section */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>Posts</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {postsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} className="hover:bg-muted/50">
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Workspace Section */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {workspaceItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} className="hover:bg-muted/50">
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Configuration Section */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>Configuration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {configItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} className="hover:bg-muted/50">
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Account Footer */}
      <SidebarFooter className="border-t">
        <div className="p-3">
          <NavLink to="/dashboard/account" className="flex items-center gap-3 hover:bg-muted/50 rounded-lg p-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-medium">
              {user?.email?.[0].toUpperCase() || "A"}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Account</p>
                <p className="text-xs text-muted-foreground truncate">Creator Plan</p>
              </div>
            )}
          </NavLink>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
