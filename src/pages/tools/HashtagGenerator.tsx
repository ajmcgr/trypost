import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Hash } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";

const HashtagGenerator = () => {
  const [topic, setTopic] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);

  const generateHashtags = () => {
    if (!topic.trim()) return;
    // Demo functionality - in production this would use AI
    const demoHashtags = [
      `#${topic.replace(/\s+/g, '')}`,
      `#${topic.replace(/\s+/g, '')}Life`,
      `#${topic.replace(/\s+/g, '')}Community`,
      `#${topic.replace(/\s+/g, '')}Daily`,
      `#Love${topic.replace(/\s+/g, '')}`,
    ];
    setHashtags(demoHashtags);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header showSignup />

      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Hash className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-reckless text-4xl md:text-5xl font-medium">Hashtag Generator</h1>
        </div>
        
        <p className="text-xl text-muted-foreground mb-12">
          Generate relevant hashtags for your social media posts to increase reach and engagement.
        </p>

        <div className="bg-card p-8 rounded-3xl border-2 border-border mb-8">
          <label className="block mb-2 font-medium">Enter your topic or keyword</label>
          <Input 
            placeholder="e.g., fitness, travel, food"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="mb-4"
          />
          <Button onClick={generateHashtags} className="w-full">Generate Hashtags</Button>
          
          {hashtags.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-3">Generated Hashtags:</h3>
              <Textarea 
                value={hashtags.join(' ')} 
                readOnly 
                className="min-h-[120px]"
              />
            </div>
          )}
        </div>

        <div className="text-center">
          <p className="text-muted-foreground mb-4">Want to schedule posts with these hashtags?</p>
          <Link to="/signup">
            <Button size="lg">Try Post Free</Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HashtagGenerator;
