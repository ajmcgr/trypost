import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';

interface Workspace {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  created_at: string;
  user_email?: string;
}

interface WorkspaceInvitation {
  id: string;
  workspace_id: string;
  email: string;
  role: 'owner' | 'admin' | 'member';
  invited_by: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
  expires_at: string;
}

interface WorkspaceContextType {
  currentWorkspace: Workspace | null;
  workspaces: Workspace[];
  members: WorkspaceMember[];
  invitations: WorkspaceInvitation[];
  userRole: 'owner' | 'admin' | 'member' | null;
  loading: boolean;
  switchWorkspace: (workspaceId: string) => void;
  refreshWorkspace: () => Promise<void>;
  canManageWorkspace: boolean;
  canAccessBilling: boolean;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [invitations, setInvitations] = useState<WorkspaceInvitation[]>([]);
  const [userRole, setUserRole] = useState<'owner' | 'admin' | 'member' | null>(null);
  const [loading, setLoading] = useState(true);

  const canManageWorkspace = userRole === 'owner' || userRole === 'admin';
  const canAccessBilling = userRole === 'owner';

  const fetchWorkspaces = async () => {
    if (!user) return;

    try {
      // Get all workspaces user is a member of
      const { data: memberData, error: memberError } = await supabase
        .from('workspace_members')
        .select('workspace_id, role')
        .eq('user_id', user.id);

      if (memberError) throw memberError;

      const workspaceIds = memberData.map(m => m.workspace_id);
      
      if (workspaceIds.length === 0) {
        setWorkspaces([]);
        setCurrentWorkspace(null);
        setLoading(false);
        return;
      }

      const { data: workspaceData, error: workspaceError } = await supabase
        .from('workspaces')
        .select('*')
        .in('id', workspaceIds);

      if (workspaceError) throw workspaceError;

      setWorkspaces(workspaceData || []);
      
      // Set current workspace (first one or from localStorage)
      const savedWorkspaceId = localStorage.getItem('currentWorkspaceId');
      const current = savedWorkspaceId 
        ? workspaceData?.find(w => w.id === savedWorkspaceId) || workspaceData?.[0]
        : workspaceData?.[0];

      if (current) {
        setCurrentWorkspace(current);
        localStorage.setItem('currentWorkspaceId', current.id);
        
        // Set user role for current workspace
        const membership = memberData.find(m => m.workspace_id === current.id);
        setUserRole(membership?.role || null);
      }
    } catch (error) {
      console.error('Error fetching workspaces:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    if (!currentWorkspace) return;

    try {
      const { data: memberData, error } = await supabase
        .from('workspace_members')
        .select('*')
        .eq('workspace_id', currentWorkspace.id);

      if (error) throw error;

      // Just set members without emails for now (requires service role key)
      setMembers(memberData || []);
    } catch (error) {
      console.error('Error fetching members:', error);
      // Fallback: just show members without emails
      const { data: memberData } = await supabase
        .from('workspace_members')
        .select('*')
        .eq('workspace_id', currentWorkspace.id);
      
      setMembers(memberData || []);
    }
  };

  const fetchInvitations = async () => {
    if (!currentWorkspace) return;

    try {
      const { data, error } = await supabase
        .from('workspace_invitations')
        .select('*')
        .eq('workspace_id', currentWorkspace.id)
        .eq('status', 'pending');

      if (error) throw error;
      setInvitations(data || []);
    } catch (error) {
      console.error('Error fetching invitations:', error);
    }
  };

  const refreshWorkspace = async () => {
    await fetchWorkspaces();
    await fetchMembers();
    await fetchInvitations();
  };

  const switchWorkspace = (workspaceId: string) => {
    const workspace = workspaces.find(w => w.id === workspaceId);
    if (workspace) {
      setCurrentWorkspace(workspace);
      localStorage.setItem('currentWorkspaceId', workspaceId);
      
      // Update user role
      supabase
        .from('workspace_members')
        .select('role')
        .eq('workspace_id', workspaceId)
        .eq('user_id', user!.id)
        .single()
        .then(({ data }) => {
          setUserRole(data?.role || null);
        });
    }
  };

  useEffect(() => {
    if (user) {
      fetchWorkspaces();
    }
  }, [user]);

  useEffect(() => {
    if (currentWorkspace) {
      fetchMembers();
      fetchInvitations();
    }
  }, [currentWorkspace]);

  return (
    <WorkspaceContext.Provider
      value={{
        currentWorkspace,
        workspaces,
        members,
        invitations,
        userRole,
        loading,
        switchWorkspace,
        refreshWorkspace,
        canManageWorkspace,
        canAccessBilling,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};
