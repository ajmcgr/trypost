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
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import postLogo from "@/assets/post-logo.png";
import postIcon from "@/assets/post-icon.png";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";
  const isActive = (path: string) => currentPath === path;
  const menuButtonClass =
    "h-[52px] rounded-2xl px-5 text-[17px] font-bold text-foreground/80 hover:bg-muted hover:text-foreground data-[active=true]:bg-[#171717] data-[active=true]:text-white data-[active=true]:font-bold";
  const menuLinkClass = "gap-5 hover:bg-transparent";
  const menuIconClass = "h-6 w-6 stroke-[2.4]";

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent className="px-3 py-5">
        {/* Logo */}
        <div className="px-2 pb-5">
          <NavLink to="/dashboard" className="flex">
            <img
              src={collapsed ? postIcon : postLogo}
              alt="Post"
              className={collapsed ? "h-8 w-8 object-contain" : "h-7"}
            />
          </NavLink>
        </div>

        {/* Collapse Button */}
        <SidebarMenu className="mb-5 gap-3 px-0">
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={toggleSidebar}
              className={menuButtonClass}
            >
              <PanelLeft className={menuIconClass} />
              {!collapsed && <span>Collapse</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Create Post Button */}
        <div className="pb-5">
          <Button
            onClick={() => navigate("/dashboard")}
            className="h-12 w-full rounded-2xl text-[17px] font-bold"
          >
            {!collapsed ? (
              <>
                <FileEdit className="mr-3 h-5 w-5" />
                Create post
              </>
            ) : (
              <FileEdit className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Flat menu */}
        <SidebarMenu className="gap-3 px-0">
          {mainItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={isActive(item.url)} className={menuButtonClass}>
                <NavLink to={item.url} className={menuLinkClass}>
                  <item.icon className={menuIconClass} />
                  {!collapsed && <span>{item.title}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="px-3 pb-6">
        <SidebarMenu className="gap-3 px-0">
          {footerItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={isActive(item.url)} className={menuButtonClass}>
                <NavLink to={item.url} className={menuLinkClass}>
                  <item.icon className={menuIconClass} />
                  {!collapsed && <span>{item.title}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
