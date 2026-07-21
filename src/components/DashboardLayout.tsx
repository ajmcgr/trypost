import { useEffect } from "react";
import { useNavigate, Outlet, NavLink } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { WorkspaceSwitcher } from "@/components/WorkspaceSwitcher";
import { NotificationsBell } from "@/components/NotificationsBell";
import { UserMenu } from "@/components/UserMenu";
import { initNotificationsPatch } from "@/lib/notifications";
import { Loader2 } from "lucide-react";
import postLogo from "@/assets/post-logo.png";

initNotificationsPatch();


const DashboardLayout = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 border-b bg-card flex items-center justify-between px-4">
            <NavLink to="/dashboard" className="flex items-center">
              <img src={postLogo} alt="Post" className="h-6 w-auto object-contain" />
            </NavLink>
            <div className="flex items-center gap-2">
              <WorkspaceSwitcher />
              <NotificationsBell />
              <UserMenu />
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
