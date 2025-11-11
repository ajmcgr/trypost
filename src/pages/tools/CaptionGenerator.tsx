import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileText } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";

const CaptionGenerator = () => {
  const [topic, setTopic] = useState("");
  const [caption, setCaption] = useState("");

  const generateCaption = () => {
    if (!topic.trim()) return;
    
    const demoCaption = `Excited to share this ${topic} with you all! ✨\n\nHere's what makes it special... [add your details]\n\nWhat do you think? Drop a comment below! 👇\n\n#${topic.replace(/\s+/g, '')} #SocialMedia #ContentCreator`;
    setCaption(demoCaption);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header showSignup />

      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-reckless text-4xl md:text-5xl font-medium">Caption Generator</h1>
        </div>
        
        <p className="text-xl text-muted-foreground mb-12">
          Generate engaging captions for your social media posts that drive engagement and grow your audience.
        </p>

        <div className="bg-card p-8 rounded-3xl border-2 border-border mb-8">
          <div className="mb-6">
            <label className="block mb-2 font-medium">What's your post about?</label>
            <Input 
              placeholder="e.g., new product launch, travel experience, fitness tip"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          
          <Button onClick={generateCaption} className="w-full mb-6">Generate Caption</Button>
          
          {caption && (
            <div>
              <label className="block mb-2 font-medium">Your Generated Caption:</label>
              <Textarea 
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="min-h-[180px]"
              />
            </div>
          )}
        </div>

        <div className="text-center">
          <p className="text-muted-foreground mb-4">Schedule posts with perfect captions</p>
          <Link to="/signup">
            <Button size="lg">Try Post Free</Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CaptionGenerator;
