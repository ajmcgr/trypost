import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarClock, FileText, Filter, HelpCircle, Loader2, RefreshCw, Send, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import twitterIcon from '@/assets/x.svg';
import linkedinIcon from '@/assets/linkedin.svg';
import instagramIcon from '@/assets/instagram.svg';
import facebookIcon from '@/assets/facebook.svg';
import youtubeIcon from '@/assets/youtube.svg';
import threadsIcon from '@/assets/threads.svg';
import tiktokIcon from '@/assets/tiktok.svg';

const platformIcons: Record<string, string> = { twitter: twitterIcon, linkedin: linkedinIcon, instagram: instagramIcon, facebook: facebookIcon, youtube: youtubeIcon, threads: threadsIcon, tiktok: tiktokIcon };
type Media = { media_id?: string; path?: string; kind?: 'image' | 'video'; url?: string; mime?: string; size?: number };
type Result = { status?: string; scheduled_for?: string; success?: boolean; error?: string };
type PostRow = { id: string; content: string | null; platforms: string[] | null; status: string | null; media: Media[] | null; results: Result[] | null; scheduled_at: string | null; created_at: string | null };

type Props = { title: string; emptyLabel: string; statuses?: string[]; layout?: 'grid' | 'list' };

const badgeClass = (status: string) => ({
  draft: 'bg-yellow-400 text-black hover:bg-yellow-500',
  scheduled: 'bg-cyan-400 text-black hover:bg-cyan-500',
  queued: 'bg-blue-400 text-black hover:bg-blue-500',
  posted: 'bg-emerald-400 text-black hover:bg-emerald-500',
  failed: 'bg-red-400 text-black hover:bg-red-500',
}[status] ?? '');

const getStatus = (post: PostRow) => post.status ?? post.results?.[0]?.status ?? (post.results?.some((result) => result.success) ? 'posted' : 'posted');
const getTimestamp = (post: PostRow) => post.scheduled_at ?? post.results?.[0]?.scheduled_for ?? post.created_at;

const formatDateTime = (value?: string | null) => {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return { date: '—', time: '' };
  return { date: date.toLocaleDateString(), time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
};

const PostList = ({ title, emptyLabel, statuses, layout = 'list' }: Props) => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [platform, setPlatform] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');
  const [busyPostId, setBusyPostId] = useState<string | null>(null);
  const [busyAction, setBusyAction] = useState<'publish' | 'schedule' | 'delete' | null>(null);

  const loadPosts = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from('posts')
      .select('id,content,platforms,status,media,results,scheduled_at,created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: sortBy === 'oldest' });
    setPosts((data ?? []) as PostRow[]);
    setLoading(false);
  };

  useEffect(() => { if (!authLoading && !user) navigate('/login'); }, [authLoading, navigate, user]);
  useEffect(() => { if (user) loadPosts(); }, [user, sortBy]);

  const publishDraft = async (post: PostRow) => {
    const platforms = post.platforms ?? [];
    if (!platforms.length) return toast.error('This draft has no selected platforms.');

    setBusyPostId(post.id);
    setBusyAction('publish');
    try {
      const { data, error } = await supabase.functions.invoke('publish-post', {
        body: {
          draftId: post.id,
          content: post.content ?? '',
          platforms,
          media: post.media ?? [],
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const results = data?.results ?? [];
      const failed = results.filter((result: Result) => !result.success).length;
      const successful = results.length - failed;

      if (successful && !failed) toast.success(`Published to ${successful} platform${successful === 1 ? '' : 's'}.`);
      else if (successful) toast.warning(`Published to ${successful}, ${failed} failed.`);
      else toast.error(results[0]?.error || 'Failed to publish draft.');

      await loadPosts();
    } catch (error: any) {
      toast.error(error.message || 'Failed to publish draft.');
    } finally {
      setBusyPostId(null);
      setBusyAction(null);
    }
  };

  const scheduleDraft = async (post: PostRow) => {
    const platforms = post.platforms ?? [];
    if (!platforms.length) return toast.error('This draft has no selected platforms.');

    const scheduledFor = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    setBusyPostId(post.id);
    setBusyAction('schedule');
    try {
      const { data, error } = await supabase.functions.invoke('publish-post', {
        body: {
          draftId: post.id,
          content: post.content ?? '',
          platforms,
          media: post.media ?? [],
          scheduledFor,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const { date, time } = formatDateTime(scheduledFor);
      toast.success(`Scheduled for ${date} ${time}`);
      await loadPosts();
    } catch (error: any) {
      toast.error(error.message || 'Failed to schedule draft.');
    } finally {
      setBusyPostId(null);
      setBusyAction(null);
    }
  };

  const deleteDraft = async (post: PostRow) => {
    if (getStatus(post) !== 'draft') return;

    setBusyPostId(post.id);
    setBusyAction('delete');
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', post.id)
        .eq('user_id', user!.id)
        .eq('status', 'draft');

      if (error) throw error;
      toast.success('Draft deleted');
      setPosts((current) => current.filter((item) => item.id !== post.id));
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete draft.');
    } finally {
      setBusyPostId(null);
      setBusyAction(null);
    }
  };

  const filteredPosts = useMemo(() => {
    const now = new Date();
    return posts.filter((post) => {
      const status = getStatus(post);
      if (statuses?.length && !statuses.includes(status)) return false;
      if (platform !== 'all' && !(post.platforms ?? []).includes(platform)) return false;
      if (timeFilter === 'all') return true;
      const basis = getTimestamp(post);
      if (!basis) return false;
      const date = new Date(basis);
      if (timeFilter === 'today') return date.toDateString() === now.toDateString();
      if (timeFilter === 'week') return now.getTime() - date.getTime() <= 7 * 24 * 60 * 60 * 1000;
      return now.getTime() - date.getTime() <= 31 * 24 * 60 * 60 * 1000;
    });
  }, [platform, posts, statuses, timeFilter]);

  if (authLoading || loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2"><h1 className="text-3xl font-bold">{title}</h1><HelpCircle className="w-5 h-5 text-muted-foreground" /></div>
        <Button variant="ghost" size="icon" onClick={loadPosts}><RefreshCw className="h-4 w-4" /></Button>
      </div>
      <div className="flex items-center gap-3 mb-6">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <Select value={sortBy} onValueChange={setSortBy}><SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="newest">Newest First</SelectItem><SelectItem value="oldest">Oldest First</SelectItem></SelectContent></Select>
        <Select value={platform} onValueChange={setPlatform}><SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger><SelectContent>{['all','twitter','instagram','facebook','linkedin','threads','youtube','tiktok'].map((item) => <SelectItem key={item} value={item}>{item === 'all' ? 'All Platforms' : item}</SelectItem>)}</SelectContent></Select>
        <Select value={timeFilter} onValueChange={setTimeFilter}><SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All Time</SelectItem><SelectItem value="today">Today</SelectItem><SelectItem value="week">This Week</SelectItem><SelectItem value="month">This Month</SelectItem></SelectContent></Select>
      </div>
      <div className={layout === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
        {filteredPosts.length ? filteredPosts.map((post) => {
          const { date, time } = formatDateTime(getTimestamp(post));
          const media = post.media?.[0];
          const status = getStatus(post);
          const platforms = post.platforms ?? [];
          const isDraft = status === 'draft';
          const isBusy = busyPostId === post.id;
          const isPublishing = isBusy && busyAction === 'publish';
          const isScheduling = isBusy && busyAction === 'schedule';
          const isDeleting = isBusy && busyAction === 'delete';
          return (
            <Card key={post.id} className="p-4">
              <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3"><span>{date}</span><span>{time}</span></div>
              <div className="flex items-start gap-2 mb-4"><FileText className="w-4 h-4 text-muted-foreground mt-1" /><span className="text-xs text-muted-foreground">{media?.kind ?? 'text'}</span></div>
              {media?.url && media.kind === 'image' && <img src={media.url} alt="Post media" className="mb-4 h-36 w-full rounded-md object-cover border" />}
              {media?.url && media.kind === 'video' && <video src={media.url} className="mb-4 h-36 w-full rounded-md object-cover border" controls />}
              <p className="mb-4 line-clamp-4 whitespace-pre-wrap">{post.content || 'Untitled post'}</p>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">{platforms.slice(0, 5).map((item) => platformIcons[item] && <img key={item} src={platformIcons[item]} alt={item} className="w-5 h-5" />)}</div>
                <div className="flex flex-wrap items-center justify-end gap-2">
                  {isDraft && (
                    <>
                      <Button size="sm" onClick={() => publishDraft(post)} disabled={isBusy}>
                        {isPublishing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                        Post now
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => scheduleDraft(post)} disabled={isBusy}>
                        {isScheduling ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CalendarClock className="mr-2 h-4 w-4" />}
                        Schedule
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => deleteDraft(post)} disabled={isBusy}>
                        {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                        Delete
                      </Button>
                    </>
                  )}
                  <Badge className={badgeClass(status)}>{status}</Badge>
                </div>
              </div>
            </Card>
          );
        }) : <div className={`${layout === 'grid' ? 'col-span-full ' : ''}flex items-center justify-center h-96 bg-muted/30 rounded-3xl`}><div className="text-center"><FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" /><p className="text-lg text-muted-foreground">{emptyLabel}</p></div></div>}
      </div>
    </div>
  );
};

export default PostList;
