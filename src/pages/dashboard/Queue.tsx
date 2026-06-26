import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Check, X, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Slot = { time: string; days: boolean[] }; // days length 7, Mon..Sun

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const formatTime = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "pm" : "am";
  const hh = ((h + 11) % 12) + 1;
  return `${hh}:${m.toString().padStart(2, "0")} ${period}`;
};

const Queue = () => {
  const { user } = useAuth();
  const [slots, setSlots] = useState<Slot[]>([
    { time: "11:00", days: [true, true, true, true, true, false, false] },
    { time: "16:00", days: [true, true, true, true, true, false, false] },
  ]);
  const [randomize, setRandomize] = useState(false);
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
  );
  const [newTime, setNewTime] = useState("12:00");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("queue_settings")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (data) {
        if (Array.isArray(data.slots) && data.slots.length) setSlots(data.slots as Slot[]);
        setRandomize(!!data.randomize);
        if (data.timezone) setTimezone(data.timezone);
      }
      setLoading(false);
    })();
  }, [user]);

  const save = async (next: Partial<{ slots: Slot[]; randomize: boolean; timezone: string }>) => {
    if (!user) return;
    setSaving(true);
    const payload = {
      user_id: user.id,
      slots: next.slots ?? slots,
      randomize: next.randomize ?? randomize,
      timezone: next.timezone ?? timezone,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from("queue_settings").upsert(payload, { onConflict: "user_id" });
    setSaving(false);
    if (error) toast.error(error.message);
  };

  const toggle = (idx: number, day: number) => {
    const next = slots.map((s, i) =>
      i === idx ? { ...s, days: s.days.map((d, di) => (di === day ? !d : d)) } : s,
    );
    setSlots(next);
    save({ slots: next });
  };

  const removeSlot = (idx: number) => {
    const next = slots.filter((_, i) => i !== idx);
    setSlots(next);
    save({ slots: next });
  };

  const addSlot = () => {
    if (slots.some((s) => s.time === newTime)) {
      toast.error("Time already exists");
      return;
    }
    const next = [...slots, { time: newTime, days: [true, true, true, true, true, false, false] }].sort(
      (a, b) => a.time.localeCompare(b.time),
    );
    setSlots(next);
    save({ slots: next });
  };

  const totalSlots = slots.reduce((acc, s) => acc + s.days.filter(Boolean).length, 0);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <Card className="p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-1">Queue Schedule</h2>
        <p className="text-muted-foreground">
          You have {totalSlots} slots to post during your week.
        </p>
        <p className="text-muted-foreground text-sm mb-4">
          Editing your schedule here won't affect posts that are already scheduled.
        </p>
        <p className="text-sm text-muted-foreground mb-4">Timezone: {timezone}</p>

        <div className="border-t">
          <div className="grid grid-cols-[140px_repeat(7,1fr)] gap-2 py-3 text-sm font-medium text-muted-foreground border-b">
            <div>Time</div>
            {DAYS.map((d) => (
              <div key={d} className="text-center">
                {d}
              </div>
            ))}
          </div>
          {slots.map((s, idx) => (
            <div
              key={idx}
              className="grid grid-cols-[140px_repeat(7,1fr)] gap-2 py-3 border-b items-center"
            >
              <div className="flex items-center gap-2">
                <span>{formatTime(s.time)}</span>
                <button
                  onClick={() => removeSlot(idx)}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Remove slot"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {s.days.map((on, di) => (
                <div key={di} className="flex justify-center">
                  <button
                    onClick={() => toggle(idx, di)}
                    className={`w-7 h-7 rounded-md flex items-center justify-center border-2 transition-colors ${
                      on
                        ? "bg-primary border-primary text-primary-foreground"
                        : "border-muted-foreground/30 hover:border-muted-foreground"
                    }`}
                  >
                    {on && <Check className="w-4 h-4" />}
                  </button>
                </div>
              ))}
            </div>
          ))}
          <div className="flex items-center gap-3 py-4">
            <Input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="w-32"
            />
            <Button variant="ghost" className="text-primary gap-2" onClick={addSlot}>
              <Plus className="w-4 h-4" /> Add time
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6 flex items-center justify-between">
        <div>
          <h3 className="font-semibold mb-1">Randomize posting time</h3>
          <p className="text-sm text-muted-foreground">
            Vary each post by up to 10 minutes so they don't always go out at the exact same time.
          </p>
        </div>
        <Switch
          checked={randomize}
          onCheckedChange={(v) => {
            setRandomize(v);
            save({ randomize: v });
          }}
        />
      </Card>

      {saving && (
        <p className="text-xs text-muted-foreground mt-3 text-right">Saving…</p>
      )}
    </div>
  );
};

export default Queue;
