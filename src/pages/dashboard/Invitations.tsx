import { useState, useEffect } from "react";
import { Mail, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useWorkspace } from "@/hooks/useWorkspace";

interface Invitation {
  id: string;
  workspace_id: string;
  email: string;
  role: 'owner' | 'admin' | 'member';
  invited_by: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
  expires_at: string;
  workspace?: {
    name: string;
  };
}

const Invitations = () => {
  const { user } = useAuth();
  const { refreshWorkspace } = useWorkspace();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchInvitations();
  }, [user]);

  const fetchInvitations = async () => {
    if (!user?.email) return;

    try {
      const { data, error } = await supabase
        .from('workspace_invitations')
        .select('*')
        .eq('email', user.email)
        .eq('status', 'pending')
        .gt('expires_at', new Date().toISOString());

      if (error) throw error;

      setInvitations(data || []);
    } catch (error) {
      console.error('Error fetching invitations:', error);
      toast.error("Failed to load invitations");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (invitationId: string) => {
    setProcessingId(invitationId);
    
    try {
      const { error } = await supabase.functions.invoke('accept-team-invitation', {
        body: { invitationId }
      });

      if (error) throw error;

      toast.success("Invitation accepted! Welcome to the workspace.");
      await refreshWorkspace();
      await fetchInvitations();
    } catch (error: any) {
      console.error('Error accepting invitation:', error);
      toast.error(error.message || "Failed to accept invitation");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDecline = async (invitationId: string) => {
    setProcessingId(invitationId);
    
    try {
      const { error } = await supabase
        .from('workspace_invitations')
        .update({ status: 'declined' })
        .eq('id', invitationId);

      if (error) throw error;

      toast.success("Invitation declined");
      await fetchInvitations();
    } catch (error) {
      console.error('Error declining invitation:', error);
      toast.error("Failed to decline invitation");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading invitations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Workspace Invitations</h1>
        <p className="text-muted-foreground">
          Accept or decline invitations to join workspaces
        </p>
      </div>

      {invitations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Mail className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground">No pending invitations</p>
            <p className="text-sm text-muted-foreground mt-2">
              You'll see invitations here when someone invites you to their workspace
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {invitations.map((invitation) => (
            <Card key={invitation.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Workspace Invitation
                </CardTitle>
                <CardDescription>
                  You've been invited as a {invitation.role} • 
                  Expires {new Date(invitation.expires_at).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleAccept(invitation.id)}
                    disabled={processingId === invitation.id}
                    className="flex-1"
                  >
                    <Check className="mr-2 h-4 w-4" />
                    {processingId === invitation.id ? "Accepting..." : "Accept"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleDecline(invitation.id)}
                    disabled={processingId === invitation.id}
                    className="flex-1"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Decline
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Invitations;
