import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Sparkles, Copy } from "lucide-react";
import { toast } from "sonner";

const TEMPLATES = [
  (t: string) => `Behind-the-scenes: how we approach ${t}`,
  (t: string) => `5 mistakes everyone makes with ${t} (and how to avoid them)`,
  (t: string) => `A 30-second guide to ${t}`,
  (t: string) => `Day in the life of someone working on ${t}`,
  (t: string) => `The one thing nobody tells you about ${t}`,
  (t: string) => `Before / after: my ${t} journey in 90 days`,
  (t: string) => `Three tools I use every week for ${t}`,
  (t: string) => `Hot take: ${t} is overrated — here's what to do instead`,
  (t: string) => `${t} explained like you're 5`,
  (t: string) => `What ${t} looked like in 2020 vs today`,
  (t: string) => `My honest review of the top ${t} tools`,
  (t: string) => `${t} myths I used to believe`,
];

const PostIdeaGenerator = () => {
  const [topic, setTopic] = useState("");
  const [ideas, setIdeas] = useState<string[]>([]);

  const generate = () => {
    if (!topic.trim()) return;
    const shuffled = [...TEMPLATES].sort(() => Math.random() - 0.5).slice(0, 8);
    setIdeas(shuffled.map((fn) => fn(topic.trim())));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header showSignup />
      <main className="max-w-3xl mx-auto px-6 py-16 w-full flex-1">
        <h1 className="font-reckless text-4xl md:text-5xl font-medium mb-4">Post Idea Generator</h1>
        <p className="text-muted-foreground mb-8">Stuck for content? Drop a topic and get 8 ready-to-write post ideas.</p>

        <div className="flex gap-2 mb-8">
          <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. email marketing, marathon training, coffee" onKeyDown={(e) => e.key === "Enter" && generate()} />
          <Button onClick={generate}><Sparkles className="w-4 h-4 mr-2" /> Generate</Button>
        </div>

        {ideas.length > 0 && (
          <div className="space-y-3">
            {ideas.map((idea, i) => (
              <Card key={i} className="p-4 flex items-center justify-between gap-3">
                <span>{idea}</span>
                <Button variant="ghost" size="sm" onClick={() => { navigator.clipboard.writeText(idea); toast.success("Copied"); }}>
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

export default PostIdeaGenerator;
