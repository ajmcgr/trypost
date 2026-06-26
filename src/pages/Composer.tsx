import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Search, ChevronDown, Send, Save, Info, ImagePlus, X, Calendar, Clock3, CircleHelp } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import xLogo from "@/assets/x.svg";
import linkedinLogo from "@/assets/linkedin.svg";
import instagramLogo from "@/assets/instagram.svg";
import facebookLogo from "@/assets/facebook.svg";
import youtubeLogo from "@/assets/youtube.svg";
import threadsLogo from "@/assets/threads.svg";
import tiktokLogo from "@/assets/tiktok.svg";

interface MediaRef {
  media_id: string;
  path: string;
  url: string;
  mime: string;
  kind: 'image' | 'video';
}

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

const platformIcons: Record<string, string> = {
  twitter: xLogo,
  linkedin: linkedinLogo,
  instagram: instagramLogo,
  facebook: facebookLogo,
  youtube: youtubeLogo,
  threads: threadsLogo,
  tiktok: tiktokLogo,
};

const quickTimes = ["11:00", "15:00", "19:00"];

const formatTimeLabel = (value: string) => {
  const [hourString = "12", minuteString = "00"] = value.split(":");
  const hour = Number(hourString);
  const suffix = hour >= 12 ? "PM" : "AM";
  const normalizedHour = hour % 12 || 12;
  return `${normalizedHour}:${minuteString} ${suffix}`;
};

const createScheduledIso = (date: Date, time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  const scheduledDate = new Date(date);
  scheduledDate.setHours(hours, minutes, 0, 0);
  return scheduledDate.toISOString();
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
  const [scheduleMode, setScheduleMode] = useState<'time' | 'queue'>('time');
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>();
  const [scheduleTime, setScheduleTime] = useState('12:00');
  const [remember, setRemember] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<string[]>([]);
  const [media, setMedia] = useState<MediaRef[]>([]);
  const [uploading, setUploading] = useState(false);
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

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');
      const uploaded: MediaRef[] = [];
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append('file', file);
        const resp = await fetch(
          `${(supabase as any).supabaseUrl}/functions/v1/upload-media`,
          { method: 'POST', headers: { Authorization: `Bearer ${session.access_token}` }, body: fd },
        );
        const j = await resp.json();
        if (!resp.ok) throw new Error(j.error || 'Upload failed');
        uploaded.push(j);
      }
      setMedia((m) => [...m, ...uploaded]);
    } catch (e: any) {
      toast.error(e.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeMedia = (id: string) => setMedia((m) => m.filter((x) => x.media_id !== id));

  const filteredConnections = connections.filter((connection) => {
    const matchesPlatform = platformFilter.length === 0 || platformFilter.includes(connection.platform);
    const value = `${platformNames[connection.platform] ?? connection.platform} ${connection.platform_username ?? ''}`.toLowerCase();
    const matchesSearch = value.includes(searchQuery.toLowerCase());
    return matchesPlatform && matchesSearch;
  });

  const canSubmit = selectedPlatforms.length > 0 && (content.trim().length > 0 || media.length > 0);

  const handleDraftSave = async () => {
    if (!content.trim() && media.length === 0) {
      toast.error('Add some content or media');
      return;
    }

    setPublishing(true);

    try {
      const { error } = await supabase.functions.invoke('publish-post', {
        body: {
          content,
          platforms: selectedPlatforms,
          media: media.map(({ media_id, path, url, mime, kind }) => ({ media_id, path, url, mime, kind })),
          draft: true,
        },
      });

      if (error) throw error;

      toast.success('Saved to drafts');
      navigate('/dashboard/drafts');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save draft');
    } finally {
      setPublishing(false);
    }
  };

  const handleSchedule = async () => {
    if (!canSubmit) {
      toast.error('Add content and choose at least one account');
      return;
    }

    if (scheduleMode === 'time' && !scheduleDate) {
      toast.error('Pick a schedule date');
      return;
    }

    setPublishing(true);

    try {
      const { error } = await supabase.functions.invoke('publish-post', {
        body: {
          content,
          platforms: selectedPlatforms,
          media: media.map(({ media_id, path, url, mime, kind }) => ({ media_id, path, url, mime, kind })),
          queue: scheduleMode === 'queue',
          scheduledFor: scheduleMode === 'time' && scheduleDate ? createScheduledIso(scheduleDate, scheduleTime) : undefined,
        },
      });

      if (error) throw error;

      toast.success(
        scheduleMode === 'queue'
          ? 'Post added to queue'
          : `Post scheduled for ${format(scheduleDate!, 'PPP')} at ${formatTimeLabel(scheduleTime)}`
      );
      navigate('/dashboard/scheduled');
    } catch (error: any) {
      toast.error(error.message || 'Failed to schedule post');
    } finally {
      setPublishing(false);
    }
  };

  const handlePublish = async () => {
    if (!content.trim() && media.length === 0) {
      toast.error('Add some content or media');
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
          media: media.map(({ media_id, path, url, mime, kind }) => ({ media_id, path, url, mime, kind })),
        },
      });

      if (error) throw error;

      const results = data.results;
      const successful = results.filter((r: any) => r.success).length;
      const failed = results.filter((r: any) => !r.success).length;

      if (failed === 0) {
        navigate('/dashboard/publishing', {
          state: {
            postData: { content, platforms: selectedPlatforms },
            successful,
            total: results.length
          }
        });
      } else if (successful > 0) {
        toast.warning(`Published to ${successful} platforms, ${failed} failed. Check the posts page for details.`);
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

      <div className="flex flex-col gap-6 xl:flex-row">
        <div className="flex-1 space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="w-fit rounded-2xl bg-muted px-5 py-6 text-foreground gap-2">
                  <Search className="w-4 h-4" />
                  Search & Filter
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-[320px] rounded-2xl p-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Search accounts</Label>
                    <Input
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Search platform or username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Filter platforms</Label>
                    <div className="flex flex-wrap gap-2">
                      {connections.map((connection) => {
                        const isActive = platformFilter.includes(connection.platform);
                        return (
                          <Button
                            key={connection.platform}
                            type="button"
                            size="sm"
                            variant={isActive ? "default" : "outline"}
                            onClick={() =>
                              setPlatformFilter((current) =>
                                current.includes(connection.platform)
                                  ? current.filter((value) => value !== connection.platform)
                                  : [...current, connection.platform]
                              )
                            }
                            className="rounded-full"
                          >
                            {platformNames[connection.platform] ?? connection.platform}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setSearchQuery('');
                      setPlatformFilter([]);
                    }}
                  >
                    Reset filters
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            
            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={remember}
                onCheckedChange={(checked) => setRemember(checked as boolean)}
              />
              <Label htmlFor="remember" className="text-sm cursor-pointer">Remember</Label>
            </div>
          </div>

          {connections.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-semibold text-foreground">
                  Select accounts to post to ({selectedPlatforms.length}/{connections.length})
                </h2>
              </div>
              <div className="flex flex-wrap gap-5">
                {filteredConnections.map((connection) => {
                  const isSelected = selectedPlatforms.includes(connection.platform);
                  return (
                    <button
                      key={connection.id}
                      type="button"
                      onClick={() => togglePlatform(connection.platform)}
                      className={`group flex flex-col items-center gap-2 rounded-2xl p-2 transition-all ${
                        isSelected ? "scale-[1.02]" : "opacity-80 hover:opacity-100"
                      }`}
                    >
                      <div className={`flex h-20 w-20 items-center justify-center rounded-full border-2 bg-card shadow-sm transition-all ${
                        isSelected ? "border-primary ring-4 ring-primary/10" : "border-border"
                      }`}>
                        <img
                          src={platformIcons[connection.platform]}
                          alt={platformNames[connection.platform]}
                          className="h-10 w-10"
                        />
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">{platformNames[connection.platform]}</div>
                        {connection.platform_username && (
                          <div className="max-w-[120px] truncate text-xs text-muted-foreground">
                            @{connection.platform_username}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
              {filteredConnections.length === 0 && (
                <Card className="rounded-2xl border-dashed p-6 text-center text-muted-foreground">
                  No accounts match your current search and filters.
                </Card>
              )}
            </div>
          )}

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

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm text-muted-foreground">Media (images / video)</Label>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
                {uploading ? 'Uploading…' : 'Add media'}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
            </div>
            {media.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {media.map((m) => (
                  <div key={m.media_id} className="relative w-24 h-24 rounded-md overflow-hidden border bg-muted">
                    {m.kind === 'image' ? (
                      <img src={m.url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <video src={m.url} className="w-full h-full object-cover" muted />
                    )}
                    <button
                      type="button"
                      onClick={() => removeMedia(m.media_id)}
                      className="absolute top-1 right-1 bg-background/80 rounded-full p-1"
                      aria-label="Remove media"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

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

        <div className="w-full xl:w-[380px] space-y-4">
          <div className="rounded-[2rem] border bg-card p-6">
            <div className="mb-5 flex items-center justify-between">
              <Label htmlFor="schedule" className="text-3xl font-semibold cursor-pointer">Schedule post</Label>
              <Switch
                id="schedule"
                checked={schedulePost}
                onCheckedChange={setSchedulePost}
              />
            </div>
            {schedulePost && (
              <div className="space-y-5">
                <Tabs
                  value={scheduleMode}
                  onValueChange={(value) => setScheduleMode(value as 'time' | 'queue')}
                >
                  <TabsList className="grid w-full grid-cols-2 rounded-2xl p-1">
                    <TabsTrigger value="time" className="rounded-xl">Pick a time</TabsTrigger>
                    <TabsTrigger value="queue" className="rounded-xl">Add to queue</TabsTrigger>
                  </TabsList>
                </Tabs>

                {scheduleMode === 'time' ? (
                  <>
                    <div className="grid grid-cols-[1fr_1fr_auto] items-center gap-3">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            className="h-20 justify-start rounded-2xl px-5 text-lg"
                          >
                            <Calendar className="mr-3 h-5 w-5" />
                            {scheduleDate ? format(scheduleDate, 'MMM d, yyyy') : 'Select date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto rounded-2xl p-0" align="start">
                          <CalendarPicker
                            mode="single"
                            selected={scheduleDate}
                            onSelect={setScheduleDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <div className="flex h-20 items-center gap-3 rounded-2xl border px-5">
                        <Clock3 className="h-5 w-5 text-muted-foreground" />
                        <Input
                          type="time"
                          value={scheduleTime}
                          onChange={(event) => setScheduleTime(event.target.value)}
                          className="border-0 px-0 text-lg shadow-none focus-visible:ring-0"
                        />
                      </div>
                      <CircleHelp className="h-6 w-6 text-muted-foreground" />
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-lg text-muted-foreground">Quick set:</span>
                      {quickTimes.map((time) => (
                        <Button
                          key={time}
                          type="button"
                          variant="outline"
                          className="rounded-2xl text-lg"
                          onClick={() => setScheduleTime(time)}
                        >
                          {formatTimeLabel(time)}
                        </Button>
                      ))}
                    </div>
                  </>
                ) : (
                  <Card className="rounded-2xl border-dashed p-5 text-muted-foreground">
                    Add this post to your next available publishing slot. Queue mode keeps your content moving without picking an exact time.
                  </Card>
                )}
              </div>
            )}
          </div>

          <Button
            onClick={schedulePost ? handleSchedule : handlePublish}
            disabled={publishing || !canSubmit || (schedulePost && scheduleMode === 'time' && !scheduleDate)}
            className="h-20 w-full rounded-2xl text-2xl font-semibold gap-3"
          >
            {publishing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {schedulePost ? 'Saving...' : 'Publishing...'}
              </>
            ) : schedulePost ? (
              <>
                <Calendar className="w-6 h-6" />
                {scheduleMode === 'queue' ? 'Add to Queue' : 'Schedule'}
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Post now
              </>
            )}
          </Button>

          {!selectedPlatforms.length && (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Info className="h-4 w-4" />
              Select an account to post to
            </p>
          )}

          <Button
            variant="outline"
            className="w-full gap-2 h-16 rounded-2xl text-xl"
            disabled={publishing || (!content.trim() && media.length === 0)}
            onClick={handleDraftSave}
          >
            <Save className="w-5 h-5" />
            Save to Drafts
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Composer;
