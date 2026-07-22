import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDays, addMonths, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, isToday, startOfMonth, startOfWeek, subMonths } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, HelpCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

type CalendarPost = {
  id: string;
  content: string | null;
  platforms: string[] | null;
  status: string | null;
  scheduled_at: string | null;
};

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const Calendar = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');
  const [posts, setPosts] = useState<CalendarPost[]>([]);
  const [loading, setLoading] = useState(false);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const rangeStart = view === 'week' ? startOfWeek(currentDate) : startOfWeek(monthStart);
  const rangeEnd = view === 'week' ? endOfWeek(currentDate) : endOfWeek(monthEnd);

  const days = useMemo(() => {
    const result: Date[] = [];
    let day = rangeStart;
    while (day <= rangeEnd) {
      result.push(day);
      day = addDays(day, 1);
    }
    return result;
  }, [rangeEnd, rangeStart]);

  useEffect(() => {
    if (!authLoading && !user) navigate('/login');
  }, [authLoading, navigate, user]);

  useEffect(() => {
    if (!user) return;

    const loadPosts = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('posts')
        .select('id,content,platforms,status,scheduled_at')
        .eq('user_id', user.id)
        .in('status', ['scheduled', 'queued'])
        .not('scheduled_at', 'is', null)
        .gte('scheduled_at', rangeStart.toISOString())
        .lte('scheduled_at', rangeEnd.toISOString())
        .order('scheduled_at', { ascending: true });

      setPosts((data ?? []) as CalendarPost[]);
      setLoading(false);
    };

    loadPosts();
  }, [rangeEnd, rangeStart, user]);

  const handlePrevious = () => {
    setCurrentDate(view === 'week' ? addDays(currentDate, -7) : subMonths(currentDate, 1));
  };

  const handleNext = () => {
    setCurrentDate(view === 'week' ? addDays(currentDate, 7) : addMonths(currentDate, 1));
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold">Calendar</h1>
          <HelpCircle className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handlePrevious} className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold min-w-[220px] text-center">
            {view === 'week'
              ? `${format(rangeStart, 'MMM d')} – ${format(rangeEnd, 'MMM d, yyyy')}`
              : format(currentDate, 'MMMM yyyy')}
          </h2>
          <Button variant="ghost" size="icon" onClick={handleNext} className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          <Button variant={view === 'month' ? 'default' : 'outline'} size="sm" onClick={() => setView('month')} className="gap-2">
            <CalendarIcon className="h-4 w-4" />
            Month
          </Button>
          <Button variant={view === 'week' ? 'default' : 'outline'} size="sm" onClick={() => setView('week')} className="gap-2">
            <CalendarIcon className="h-4 w-4" />
            Week
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-lg border overflow-hidden">
        <div className="grid grid-cols-7 border-b">
          {dayNames.map((dayName) => (
            <div key={dayName} className="p-4 text-center text-sm font-medium text-muted-foreground border-r last:border-r-0">
              {dayName}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {days.map((day) => {
            const postsForDay = posts.filter((post) => post.scheduled_at && isSameDay(new Date(post.scheduled_at), day));
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isTodayDate = isToday(day);

            return (
              <div
                key={day.toISOString()}
                className={`min-h-[120px] p-3 border-r border-b last:border-r-0 ${
                  isTodayDate ? 'bg-primary/10' : ''
                } ${!isCurrentMonth && view === 'month' ? 'bg-muted/30' : ''}`}
              >
                <div className="flex flex-col h-full">
                  <span className={`text-sm mb-2 ${!isCurrentMonth && view === 'month' ? 'text-muted-foreground' : ''} ${isTodayDate ? 'font-semibold text-primary' : ''}`}>
                    {format(day, 'MMM d')}
                  </span>
                  <div className="space-y-2">
                    {postsForDay.length ? postsForDay.slice(0, 3).map((post) => (
                      <button
                        key={post.id}
                        onClick={() => navigate('/dashboard/scheduled')}
                        className="w-full rounded-md bg-primary/10 px-2 py-1 text-left text-xs hover:bg-primary/20"
                      >
                        <span className="font-medium">{format(new Date(post.scheduled_at!), 'HH:mm')}</span>
                        <span className="ml-1 text-muted-foreground">
                          {(post.content || post.platforms?.join(', ') || 'Scheduled post').slice(0, 32)}
                        </span>
                      </button>
                    )) : (
                      <span className="text-sm text-muted-foreground">No posts</span>
                    )}
                    {postsForDay.length > 3 && (
                      <button onClick={() => navigate('/dashboard/scheduled')} className="text-xs text-primary">
                        +{postsForDay.length - 3} more
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
