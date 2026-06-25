import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2, Search, ChevronDown, Send, Save, Info, Upload, Image as ImageIcon, X, Check } from 'lucide-react';
import { toast } from 'sonner';
import twitterIcon from '@/assets/x.svg';
import linkedinIcon from '@/assets/linkedin.svg';
import instagramIcon from '@/assets/instagram.svg';
import facebookIcon from '@/assets/facebook.svg';
import youtubeIcon from '@/assets/youtube.svg';
import threadsIcon from '@/assets/threads.svg';
import tiktokIcon from '@/assets/tiktok.svg';

const platformIcons: Record<string, string> = {
  twitter: twitterIcon,
  linkedin: linkedinIcon,
  instagram: instagramIcon,
  facebook: facebookIcon,
  youtube: youtubeIcon,
  threads: threadsIcon,
  tiktok: tiktokIcon,
};

const platformNames: Record<string, string> = {
  twitter: 'Twitter / X',
  linkedin: 'LinkedIn',
  instagram: 'Instagram',
  facebook: 'Facebook',
  youtube: 'YouTube',
  threads: 'Threads',
  tiktok: 'TikTok',
};

interface OAuthConnection {
  id: string;
  platform: string;
  platform_username: string | null;
  is_connected: boolean;
}

const ImageComposer = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [connections, setConnections] = useState<OAuthConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [schedulePost, setSchedulePost] = useState(false);
  const [remember, setRemember] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      toast.error('Please select valid image files');
      return;
    }

    setSelectedImages(prev => [...prev, ...imageFiles]);

    // Create previews
    imageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = Array.from(e.clipboardData.items);
    const imageItems = items.filter(item => item.type.startsWith('image/'));
    
    if (imageItems.length > 0) {
      const files = imageItems.map(item => item.getAsFile()).filter(Boolean) as File[];
      handleFiles(files);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handlePublish = async () => {
    if (!content.trim() && selectedImages.length === 0) {
      toast.error('Please add content or images');
      return;
    }

    if (connections.length === 0) {
      toast.error('Please connect at least one account');
      return;
    }

    setPublishing(true);
    toast.success('Image post publishing coming soon!');
    setPublishing(false);
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
      <h1 className="text-3xl font-bold mb-6">Create image post</h1>

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

          {/* Image Upload Area */}
          <Card 
            className="border-2 border-dashed hover:border-primary/50 transition-all cursor-pointer"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onPaste={handlePaste}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="p-12 text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center">
                  <ImageIcon className="w-10 h-10 text-foreground" strokeWidth={1.5} />
                </div>
              </div>
              
              <div>
                <p className="text-lg font-medium mb-2">Click to upload or drag and drop</p>
                <p className="text-sm text-muted-foreground">or hover and paste from clipboard</p>
              </div>

              <div className="flex items-center justify-center gap-2">
                <Label className="text-sm text-muted-foreground">Image(s)</Label>
                <Info className="w-4 h-4 text-muted-foreground" />
              </div>

              <Button 
                className="gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                <Upload className="w-4 h-4" />
                Import
              </Button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />
          </Card>

          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={preview} 
                    alt={`Upload ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
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
                className="min-h-[200px] resize-none text-base"
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
            disabled={publishing || (selectedImages.length === 0 && !content.trim()) || connections.length === 0}
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
            disabled={selectedImages.length === 0 && !content.trim()}
          >
            <Save className="w-4 h-4" />
            Save to Drafts
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImageComposer;
