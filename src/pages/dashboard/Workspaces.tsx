import { useState } from "react";
import { Home, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import alexImage from "@/assets/alex-macgregor.png";

const Workspaces = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  
  // Mock current plan - replace with actual plan from user data
  const currentPlan: "Creator" | "Pro" | "Business" = "Creator";

  // Mock workspaces data - replace with actual data from database
  const workspaces = [
    {
      id: 1,
      name: "main",
      isDefault: true,
      memberCount: 1,
      members: [
        {
          id: 1,
          username: "@alexmacgregor__",
          avatar: alexImage,
        },
      ],
    },
  ];

  const handleAddWorkspace = () => {
    if (currentPlan === "Creator" || currentPlan === "Pro") {
      toast.error("Upgrade to Business plan to create multiple workspaces");
      return;
    }
    setShowCreateDialog(true);
  };

  const handleCreateWorkspace = () => {
    if (!newWorkspaceName.trim()) {
      toast.error("Please enter a workspace name");
      return;
    }
    // TODO: Implement workspace creation
    toast.success("Workspace created successfully");
    setShowCreateDialog(false);
    setNewWorkspaceName("");
  };

  const handleMoveAccount = (workspaceId: number, memberId: number) => {
    // TODO: Implement account moving
    toast.success("Account moved successfully");
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-3xl font-bold">Manage Workspaces</h1>
          <p className="text-muted-foreground">
            Organize your social accounts across different workspaces
          </p>
        </div>
        <Button onClick={handleAddWorkspace} className="bg-emerald-500 hover:bg-emerald-600">
          <Plus className="mr-2 h-4 w-4" />
          Add Workspace
        </Button>
      </div>

      {/* Workspaces List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {workspaces.map((workspace) => (
          <Card key={workspace.id} className="border-2 border-emerald-500">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <Home className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{workspace.name}</h3>
                    {workspace.isDefault && (
                      <span className="text-xs text-muted-foreground">Default</span>
                    )}
                  </div>
                </div>
                <Badge variant="secondary" className="rounded-full">
                  {workspace.memberCount}
                </Badge>
              </div>

              <div className="space-y-2">
                {workspace.members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.username[1]?.toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{member.username}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMoveAccount(workspace.id, member.id)}
                    >
                      Move
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Workspace Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Workspace</DialogTitle>
            <DialogDescription>
              Give your workspace a name to organize your social accounts
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="workspace-name">Workspace Name</Label>
              <Input
                id="workspace-name"
                placeholder="e.g., My Agency"
                value={newWorkspaceName}
                onChange={(e) => setNewWorkspaceName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateWorkspace}>Create Workspace</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Workspaces;