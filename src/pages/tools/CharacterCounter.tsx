import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy } from "lucide-react";
import { toast } from "sonner";

const platforms = [
  { name: "X / Twitter", limit: 280 },
  { name: "Threads", limit: 500 },
  { name: "Facebook", limit: 63206 },
  { name: "Instagram caption", limit: 2200 },
  { name: "LinkedIn post", limit: 3000 },
  { name: "TikTok caption", limit: 2200 },
  { name: "YouTube description", limit: 5000 },
  { name: "YouTube Shorts title", limit: 100 },
];

const CharacterCounter = () => {
  const [text, setText] = useState("");
  const len = text.length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header showSignup />
      <main className="max-w-3xl mx-auto px-6 py-16 w-full flex-1">
        <h1 className="font-reckless text-4xl md:text-5xl font-medium mb-4">Character Counter</h1>
        <p className="text-muted-foreground mb-8">Stay inside every platform limit before you hit publish.</p>

        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or write your post here..."
          className="min-h-[200px] text-base"
        />
        <div className="flex items-center justify-between mt-3 mb-8">
          <div className="text-sm text-muted-foreground">{words} words · {len} characters</div>
          <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(text); toast.success("Copied"); }}>
            <Copy className="w-4 h-4 mr-2" /> Copy
          </Button>
        </div>

        <div className="space-y-2">
          {platforms.map((p) => {
            const over = len > p.limit;
            const pct = Math.min(100, (len / p.limit) * 100);
            return (
              <div key={p.name} className="border rounded-lg p-3">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">{p.name}</span>
                  <span className={over ? "text-destructive font-medium" : "text-muted-foreground"}>
                    {len}/{p.limit.toLocaleString()} {over && `(${len - p.limit} over)`}
                  </span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full ${over ? "bg-destructive" : "bg-primary"}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CharacterCounter;
