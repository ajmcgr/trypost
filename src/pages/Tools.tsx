import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Hash, Calendar, Calculator, User, MessageSquare, ArrowRight, Type, Lightbulb, Smile, Megaphone } from "lucide-react";

export const allTools = [
  { to: "/tools/hashtag-generator", title: "Hashtag Generator", desc: "Generate relevant hashtags for any topic.", Icon: Hash },
  { to: "/tools/content-planner", title: "Content Planner", desc: "Plan a week of content in minutes.", Icon: Calendar },
  { to: "/tools/influencer-rate-calculator", title: "Influencer Rate Calculator", desc: "Estimate fair rates for sponsored posts.", Icon: Calculator },
  { to: "/tools/bio-text-generator", title: "Bio Text Generator", desc: "Write a profile bio that converts.", Icon: User },
  { to: "/tools/caption-generator", title: "Caption Generator", desc: "Turn ideas into scroll-stopping captions.", Icon: MessageSquare },
  { to: "/tools/character-counter", title: "Character Counter", desc: "Check your post against every platform limit.", Icon: Type },
  { to: "/tools/post-idea-generator", title: "Post Idea Generator", desc: "Get 8 ready-to-write ideas from any topic.", Icon: Lightbulb },
  { to: "/tools/emoji-picker", title: "Emoji Picker", desc: "Browse and copy emojis by category.", Icon: Smile },
  { to: "/tools/announcement-generator", title: "Announcement Generator", desc: "Six launch-ready post variations.", Icon: Megaphone },
];

const Tools = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header showSignup />
      <main className="max-w-5xl mx-auto px-6 py-16 w-full flex-1">
        <h1 className="font-reckless text-4xl md:text-5xl font-medium mb-4">Free Tools</h1>
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl">
          Free utilities to help you create, plan and grow on social media.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {allTools.map(({ to, title, desc, Icon }) => (
            <Link
              key={to}
              to={to}
              className="group bg-card p-6 rounded-2xl border-2 border-border hover:border-primary transition-colors flex gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="font-reckless text-xl font-medium mb-1 group-hover:text-primary transition-colors">{title}</h2>
                <p className="text-muted-foreground text-sm mb-3">{desc}</p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Open tool <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Tools;
