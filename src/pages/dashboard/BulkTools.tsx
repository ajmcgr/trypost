import { Layers, Video, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import facebookIcon from "@/assets/facebook.svg";
import instagramIcon from "@/assets/instagram.svg";
import linkedinIcon from "@/assets/linkedin.svg";
import pinterestIcon from "@/assets/post-icon.png";
import tiktokIcon from "@/assets/tiktok.svg";
import twitterIcon from "@/assets/x.svg";
import threadsIcon from "@/assets/threads.svg";
import youtubeIcon from "@/assets/youtube.svg";

const BulkTools = () => {
  const socialIcons = [
    facebookIcon,
    instagramIcon,
    linkedinIcon,
    pinterestIcon,
    tiktokIcon,
    twitterIcon,
    threadsIcon,
    youtubeIcon,
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Bulk tools</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
        <Card className="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer">
          <CardHeader className="text-center pb-3">
            <div className="flex justify-center gap-3 mb-4 text-muted-foreground">
              <Layers className="w-12 h-12" />
              <Video className="w-12 h-12" />
            </div>
            <CardTitle className="flex items-center justify-center gap-2">
              Bulk Video Upload
              <Badge variant="secondary" className="text-xs">NEW</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <CardDescription className="mb-4">
              Upload and schedule multiple videos at once.
            </CardDescription>
            <div className="flex justify-center gap-3 flex-wrap">
              {socialIcons.map((icon, index) => (
                <img
                  key={index}
                  src={icon}
                  alt="Social platform"
                  className="w-6 h-6 opacity-40"
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer">
          <CardHeader className="text-center pb-3">
            <div className="flex justify-center gap-3 mb-4 text-muted-foreground">
              <Sparkles className="w-12 h-12" />
              <Video className="w-12 h-12" />
            </div>
            <CardTitle className="flex items-center justify-center gap-2">
              Bulk Video Creation
              <Badge variant="secondary" className="text-xs">NEW</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <CardDescription>
              Create viral 2x2 grid videos in bulk (AI assisted)
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BulkTools;
