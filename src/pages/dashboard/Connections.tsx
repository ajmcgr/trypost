import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import facebookLogo from "@/assets/facebook.svg";
import xLogo from "@/assets/x.svg";
import linkedinLogo from "@/assets/linkedin.svg";
import instagramLogo from "@/assets/instagram.svg";
import youtubeLogo from "@/assets/youtube.svg";
import threadsLogo from "@/assets/threads.svg";
import tiktokLogo from "@/assets/tiktok.svg";

interface OAuthConnection {
  id: string;
  platform: string;
  platform_username: string | null;
  is_connected: boolean;
}

const platforms = [
  { id: 'twitter', name: 'Twitter / X', icon: xLogo },
  { id: 'linkedin', name: 'LinkedIn', icon: linkedinLogo },
  { id: 'instagram', name: 'Instagram', icon: instagramLogo },
  { id: 'facebook', name: 'Facebook', icon: facebookLogo },
  { id: 'youtube', name: 'YouTube', icon: youtubeLogo },
  { id: 'threads', name: 'Threads', icon: threadsLogo },
  { id: 'tiktok', name: 'TikTok', icon: tiktokLogo },
];

const Connections = () => {
  const { user } = useAuth();
  const [connections, setConnections] = useState<OAuthConnection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadConnections();
    }
  }, [user]);

  const loadConnections = async () => {
    const { data, error } = await supabase
      .from('oauth_connections')
      .select('*')
      .eq('user_id', user?.id);

    if (!error && data) {
      setConnections(data);
    }
    setLoading(false);
  };

  const handleConnect = async (platform: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.functions.invoke(`oauth-${platform}`, {
        body: { redirect_uri: window.location.origin }
      });
      
      if (error) throw error;
      
      if (data.authUrl) {
        window.location.href = data.authUrl;
      }
    } catch (error: any) {
      console.error('Connection error:', error);
      alert(`Failed to connect to ${platform}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async (connectionId: string) => {
    await supabase
      .from('oauth_connections')
      .delete()
      .eq('id', connectionId);
    
    loadConnections();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8 flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Connections</h1>
        <p className="text-muted-foreground">Manage your social media connections</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {platforms.map((platform) => {
          const connection = connections.find(c => c.platform === platform.id);
          const isConnected = connection?.is_connected;

          return (
            <Card key={platform.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={platform.icon} alt={platform.name} className="w-8 h-8" />
                    <div>
                      <CardTitle className="text-lg">{platform.name}</CardTitle>
                      {connection?.platform_username && (
                        <CardDescription>@{connection.platform_username}</CardDescription>
                      )}
                    </div>
                  </div>
                  {isConnected && (
                    <Badge variant="default">Connected</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isConnected ? (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => connection && handleDisconnect(connection.id)}
                  >
                    Disconnect
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => handleConnect(platform.id)}
                  >
                    Connect
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Connections;
