import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Home, Plus, Settings } from "lucide-react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { toast } from "sonner";

export function WorkspaceSwitcher() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const currentPlan: "Creator" | "Pro" | "Business" = "Creator";
  const currentWorkspace = "main";

  const handleNew = () => {
    if (currentPlan === "Creator" || currentPlan === "Pro") {
      setShowUpgrade(true);
      setOpen(false);
    } else {
      toast.success("Creating new workspace...");
      setOpen(false);
    }
  };

  const handleManage = () => {
    navigate("/dashboard/workspaces");
    setOpen(false);
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2 hover:bg-muted/50">
            <Home className="h-4 w-4" />
            <span>{currentWorkspace}</span>
            <ChevronDown className="h-4 w-4 opacity-60" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-2" align="end">
          <div className="space-y-1">
            <Button variant="secondary" className="w-full justify-start">
              <Home className="mr-2 h-4 w-4" />
              {currentWorkspace}
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={handleManage}>
              <Settings className="mr-2 h-4 w-4" />
              Manage Workspaces
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={handleNew}>
              <Plus className="mr-2 h-4 w-4" />
              New Workspace
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <AlertDialog open={showUpgrade} onOpenChange={setShowUpgrade}>
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
