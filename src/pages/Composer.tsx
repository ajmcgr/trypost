import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2, Search, ChevronDown, Send, Save, Info } from 'lucide-react';
import { toast } from 'sonner';

interface OAuthConnection {
  id: string;
  platform: string;
  platform_username: string | null;
  is_connected: boolean;
}

const platformNames: Record<string, string> = {
  twitter: 'Twitter / X',
  linkedin: 'LinkedIn',
  instagram: 'Instagram',
  facebook: 'Facebook',
  youtube: 'YouTube',
  threads: 'Threads',
  tiktok: 'TikTok',
};

const Composer = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [content, setContent] = useState(location.state?.content || '');
  const [connections, setConnections] = useState<OAuthConnection[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [schedulePost, setSchedulePost] = useState(false);
  const [remember, setRemember] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      loadConnections();
    }
  }, [user]);

  const loadConnections = async () => {
    const { data, error } = await supabase
      .from('oauth_connections')
      .select('*')
      .eq('user_id', user?.id)
      .eq('is_connected', true);

    if (!error && data) {
      setConnections(data);
    }
    setLoading(false);
  };

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handlePublish = async () => {
    if (!content.trim()) {
      toast.error('Please enter some content');
      return;
    }

    if (selectedPlatforms.length === 0) {
      toast.error('Please select at least one platform');
      return;
    }

    setPublishing(true);

    try {
      const { data, error } = await supabase.functions.invoke('publish-post', {
        body: {
          content,
          platforms: selectedPlatforms,
        },
      });

      if (error) throw error;

      const results = data.results;
      const successful = results.filter((r: any) => r.success).length;
      const failed = results.filter((r: any) => !r.success).length;

      if (failed === 0) {
        // Navigate to publishing screen on success
        navigate('/dashboard/publishing', {
          state: {
            postData: { content, platforms: selectedPlatforms },
            successful,
            total: results.length
          }
        });
      } else if (successful > 0) {
        toast.warning(`Published to ${successful} platforms, ${failed} failed. Check the posts page for details.`);
        // Still navigate to posts on partial success
        setTimeout(() => navigate('/dashboard/posts'), 2000);
      } else {
        toast.error('Failed to publish to any platform. Please try again.');
        setPublishing(false);
      }
    } catch (error: any) {
      console.error('Publishing error:', error);
      toast.error(error.message || 'Failed to publish. Please try again.');
      setPublishing(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">Create text post</h1>

      <div className="flex gap-6">
        {/* Main Content Area */}
        <div className="flex-1 space-y-6">
          {/* Top Bar */}
          <div className="flex items-center justify-between">
            <Button variant="ghost" className="text-muted-foreground gap-2">
              <Search className="w-4 h-4" />
              Search & Filter
              <ChevronDown className="w-4 h-4" />
            </Button>
            
            <div className="flex items-center gap-2">
              <Checkbox 
                id="remember" 
                checked={remember}
                onCheckedChange={(checked) => setRemember(checked as boolean)}
              />
              <Label htmlFor="remember" className="text-sm cursor-pointer">Remember</Label>
            </div>
          </div>

          {/* Connection Alert */}
          {connections.length === 0 && (
            <Card className="bg-muted/30 border-0">
              <div className="p-8 text-center space-y-4">
                <h3 className="text-xl font-semibold">No accounts connected</h3>
                <p className="text-muted-foreground">
                  Connect your social media accounts to start creating posts
                </p>
                <Button 
                  onClick={() => navigate('/dashboard/connections')}
                >
                  Connect Accounts
                </Button>
              </div>
            </Card>
          )}

          {/* Main Caption */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label className="text-base font-medium">Main Caption</Label>
              <Info className="w-4 h-4 text-muted-foreground" />
            </div>
            
            <div className="relative">
              <Textarea
                placeholder="Start writing your post here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[300px] resize-none text-base"
                maxLength={2200}
              />
              <div className="absolute bottom-3 right-3 text-sm text-muted-foreground">
                {content.length}/2200
              </div>
            </div>
          </div>

          {/* Post Configuration Tools */}
          <div className="space-y-3">
            <Label className="text-sm text-muted-foreground">Post configurations & tools</Label>
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2">
                <span className="text-muted-foreground">📱</span>
                Platform Captions
                <ChevronDown className="w-4 h-4" />
              </Button>
              <Button variant="outline" className="gap-2">
                <span className="text-muted-foreground">✏️</span>
                Past Captions
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 space-y-4">
          {/* Schedule Toggle */}
          <div className="flex items-center justify-between p-4 bg-card rounded-lg border">
            <Label htmlFor="schedule" className="font-medium cursor-pointer">Schedule post</Label>
            <Switch 
              id="schedule"
              checked={schedulePost}
              onCheckedChange={setSchedulePost}
            />
          </div>

          {/* Post Now Button */}
          <Button 
            onClick={handlePublish}
            disabled={publishing || !content.trim() || connections.length === 0}
            className="w-full gap-2 h-12"
          >
            {publishing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Post now
              </>
            )}
          </Button>
          
          {connections.length === 0 && (
            <p className="text-sm text-muted-foreground text-center">
              Select an account to post to
            </p>
          )}

          {/* Save to Drafts */}
          <Button 
            variant="outline" 
            className="w-full gap-2 h-12"
            disabled={!content.trim()}
          >
            <Save className="w-4 h-4" />
            Save to Drafts
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Composer;
