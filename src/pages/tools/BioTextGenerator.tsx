import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { User } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";

const BioTextGenerator = () => {
  const [name, setName] = useState("");
  const [profession, setProfession] = useState("");
  const [bio, setBio] = useState("");

  const generateBio = () => {
    if (!name.trim() || !profession.trim()) return;
    
    const demoBio = `${name} | ${profession}\n✨ Creating amazing content\n📍 Sharing my journey\n💡 Let's connect and grow together`;
    setBio(demoBio);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header showSignup />

      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <User className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-reckless text-4xl md:text-5xl font-medium">Bio Text Generator</h1>
        </div>
        
        <p className="text-xl text-muted-foreground mb-12">
          Generate compelling social media bios that capture your personality and attract followers.
        </p>

        <div className="bg-card p-8 rounded-3xl border-2 border-border mb-8">
          <div className="space-y-4 mb-6">
            <div>
              <label className="block mb-2 font-medium">Your Name</label>
              <Input 
                placeholder="e.g., Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">Your Profession/Focus</label>
              <Input 
                placeholder="e.g., Content Creator, Fitness Coach"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
              />
            </div>
          </div>
          
          <Button onClick={generateBio} className="w-full mb-6">Generate Bio</Button>
          
          {bio && (
            <div>
              <label className="block mb-2 font-medium">Your Generated Bio:</label>
              <Textarea 
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
          )}
        </div>

        <div className="text-center">
          <p className="text-muted-foreground mb-4">Ready to build your social media presence?</p>
          <Link to="/signup">
            <Button size="lg">Try Post Free</Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BioTextGenerator;
