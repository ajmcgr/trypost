import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Copy, Sparkles } from "lucide-react";
import { toast } from "sonner";

const STYLES = [
  (h: string) => `${h} — coming soon`,
  (h: string) => `Big news: ${h} just launched 🚀`,
  (h: string) => `Today we're shipping ${h}.`,
  (h: string) => `Introducing ${h} — built for makers like you.`,
  (h: string) => `${h} is here. And it's free.`,
  (h: string) => `What if you could ${h.toLowerCase()} in one click?`,
];

const AnnouncementGenerator = () => {
  const [headline, setHeadline] = useState("");
  const [results, setResults] = useState<string[]>([]);

  const gen = () => {
    if (!headline.trim()) return;
    setResults(STYLES.map((fn) => fn(headline.trim())));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header showSignup />
      <main className="max-w-3xl mx-auto px-6 py-16 w-full flex-1">
        <h1 className="font-reckless text-4xl md:text-5xl font-medium mb-4">Announcement Generator</h1>
        <p className="text-muted-foreground mb-8">Six ready-to-post variations for your next launch or update.</p>

        <div className="flex gap-2 mb-8">
          <Input value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="e.g. our iOS app, 50% off, version 2.0" onKeyDown={(e) => e.key === "Enter" && gen()} />
          <Button onClick={gen}><Sparkles className="w-4 h-4 mr-2" /> Generate</Button>
        </div>

        {results.length > 0 && (
          <div className="space-y-3">
            {results.map((r, i) => (
              <Card key={i} className="p-4 flex items-center justify-between gap-3">
                <span>{r}</span>
                <Button variant="ghost" size="sm" onClick={() => { navigator.clipboard.writeText(r); toast.success("Copied"); }}>
                  <Copy className="w-4 h-4" />
                </Button>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AnnouncementGenerator;
