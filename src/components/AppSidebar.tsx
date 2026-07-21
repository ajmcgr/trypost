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
  CreditCard,
  HelpCircle,
  SquareUser,
  LogOut,
  ChevronDown,
  Home,
  Plus,
  ListOrdered,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useWorkspace } from "@/hooks/useWorkspace";
import { Button } from "./ui/button";
import postLogo from "@/assets/post-logo.png";
import postIcon from "@/assets/post-icon.png";

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
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

const createItems = [
  { title: "New post", url: "/dashboard", icon: FileEdit },
  { title: "Bulk post", url: "/dashboard/bulk-tools", icon: Layers },
];

const postsItems = [
  { title: "Calendar", url: "/dashboard/calendar", icon: Calendar },
  { title: "Queue", url: "/dashboard/queue", icon: ListOrdered },
  { title: "All", url: "/dashboard/posts", icon: FileStack },
  { title: "Scheduled", url: "/dashboard/scheduled", icon: Clock },
  { title: "Posted", url: "/dashboard/posted", icon: CheckCircle2 },
  { title: "Drafts", url: "/dashboard/drafts", icon: FileCheck },
];

const workspaceItems = [
  { title: "Teams", url: "/dashboard/teams", icon: Users },
];

const configItems = [
  { title: "Social Platforms", url: "/dashboard/connections", icon: Link2 },
];

const accountItems = [
  { title: "Settings", url: "/dashboard/account/settings", icon: Settings },
  { title: "Plans", url: "/dashboard/account/plans", icon: SquareUser },
  { title: "Support", url: "/dashboard/account/support", icon: HelpCircle },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { userRole, canAccessBilling } = useWorkspace();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [accountOpen, setAccountOpen] = useState(false);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  
  // Mock current plan - replace with actual plan from user data
  const currentPlan: "Creator" | "Pro" | "Business" = "Creator";
  const currentWorkspace = "main";
  
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;

  const handleBilling = () => {
    if (!canAccessBilling) {
      toast.error("Only workspace owners can access billing");
      return;
    }
    // TODO: Implement Stripe portal integration
    window.open("https://billing.stripe.com/p/login/test_00000000000000000000000000", "_blank");
  };

  const handleNewWorkspace = () => {
    if (currentPlan === "Creator" || currentPlan === "Pro") {
      setShowUpgradeDialog(true);
      setWorkspaceOpen(false);
    } else {
      // TODO: Implement workspace creation
      toast.success("Creating new workspace...");
      setWorkspaceOpen(false);
    }
  };

  const handleManageWorkspaces = () => {
    navigate("/dashboard/workspaces");
    setWorkspaceOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  return (
    <>
      <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
        <SidebarContent>
          {/* Logo */}
          <div className="p-3 border-b">
            <NavLink to="/dashboard" className="flex mb-3">
              <img 
                src={collapsed ? postIcon : postLogo} 
                alt="Post" 
                className={collapsed ? "h-8 w-8 object-contain" : "h-7"} 
              />
            </NavLink>

            {/* Workspace Selector */}
            {!collapsed && (
              <div>
                <p className="text-xs text-muted-foreground mb-2 px-2">Workspace</p>
                <Popover open={workspaceOpen} onOpenChange={setWorkspaceOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between hover:bg-muted/50">
                      <div className="flex items-center gap-2">
                        <Home className="h-4 w-4" />
                        <span>{currentWorkspace}</span>
                      </div>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-2" align="start">
                    <div className="space-y-1">
                      <Button
                        variant="secondary"
                        className="w-full justify-start"
                      >
                        <Home className="mr-2 h-4 w-4" />
                        {currentWorkspace}
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={handleManageWorkspaces}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Manage Workspaces
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={handleNewWorkspace}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        New Workspace
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>

        {/* Collapse Toggle */}
        <div className="px-3 pt-3 flex items-center justify-between">
          <SidebarTrigger />
          {!collapsed && (
            <span className="text-sm font-medium text-sidebar-foreground">Collapse</span>
          )}
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
        <Collapsible open={accountOpen} onOpenChange={setAccountOpen} className="group/collapsible">
          <CollapsibleTrigger asChild>
            <SidebarMenuButton className="w-full">
              <div className="flex items-center gap-3 w-full">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-medium flex-shrink-0">
                  {user?.email?.[0].toUpperCase() || "A"}
                </div>
                {!collapsed && (
                  <>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-medium truncate">Account</p>
                      <p className="text-xs text-muted-foreground truncate">Creator Plan</p>
                    </div>
                    <ChevronDown className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                  </>
                )}
              </div>
            </SidebarMenuButton>
          </CollapsibleTrigger>
          {!collapsed && (
            <CollapsibleContent className="space-y-1 px-2 py-2">
              <SidebarMenu>
                {accountItems.map((item) => {
                  // Hide Plans for non-owners
                  if (item.title === "Plans" && !canAccessBilling) {
                    return null;
                  }
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive(item.url)}>
                        <NavLink to={item.url} className="hover:bg-muted/50">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
                {canAccessBilling && (
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={handleBilling}>
                      <CreditCard className="h-4 w-4" />
                      <span>Billing</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={handleLogout} className="text-red-600 hover:text-red-600 hover:bg-red-50">
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </CollapsibleContent>
          )}
        </Collapsible>
      </SidebarFooter>
      </Sidebar>

      {/* Upgrade Dialog */}
      <AlertDialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Upgrade to Business Plan</AlertDialogTitle>
            <AlertDialogDescription>
              Creating multiple workspaces is only available on the Business plan. 
              Upgrade now to create unlimited workspaces and collaborate with your team.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => navigate("/dashboard/account/plans")}>
              View Plans
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
