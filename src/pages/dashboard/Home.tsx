import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, FileText, Image, Video, Facebook, Twitter, Linkedin, Instagram, Youtube, Pin } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hasConnections, setHasConnections] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      checkConnections();
    }
  }, [user]);

  const checkConnections = async () => {
    const { data, error } = await supabase
      .from('oauth_connections')
      .select('id')
      .eq('user_id', user?.id)
      .eq('is_connected', true)
      .limit(1);

    if (!error && data && data.length > 0) {
      setHasConnections(true);
    }
    setLoading(false);
  };

  const postTypes = [
    {
      title: "Text Post",
      icon: FileText,
      platforms: [Facebook, Twitter, Linkedin, Instagram, Twitter],
      route: "/dashboard/composer",
    },
    {
      title: "Image Post",
      icon: Image,
      platforms: [Facebook, Twitter, Linkedin, Instagram, Twitter, Instagram, Pin],
      route: "/dashboard/image-composer",
    },
    {
      title: "Video Post",
      icon: Video,
      platforms: [Facebook, Twitter, Linkedin, Instagram, Twitter, Instagram, Pin, Youtube],
      route: "/dashboard/video-composer",
    },
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-8">Create a new post</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {postTypes.map((type) => (
          <Card
            key={type.title}
            className="border-2 border-dashed hover:border-primary/50 transition-all cursor-pointer group"
            onClick={() => navigate(type.route)}
          >
            <CardContent className="flex flex-col items-center justify-center py-12 px-6">
              <div className="mb-4 text-muted-foreground/30 group-hover:text-muted-foreground/50 transition-colors">
                <type.icon className="w-20 h-20 stroke-[1.5]" />
              </div>
              <h3 className="text-xl font-semibold mb-6">{type.title}</h3>
              <div className="flex flex-wrap gap-2 justify-center opacity-40">
                {type.platforms.map((Platform, idx) => (
                  <Platform key={idx} className="w-5 h-5 text-muted-foreground" />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!loading && !hasConnections && (
        <div className="bg-muted/30 rounded-xl p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-muted-foreground" />
            <p className="text-foreground">Connect your social media accounts</p>
          </div>
          <Button 
            onClick={() => navigate('/dashboard/connections')}
            className="bg-[#7ED957] hover:bg-[#6FC847] text-black font-medium"
          >
            Connect Accounts
          </Button>
        </div>
      )}
    </div>
  );
};

export default Home;
