import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DollarSign } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";

const InfluencerRateCalculator = () => {
  const [followers, setFollowers] = useState("");
  const [engagement, setEngagement] = useState("");
  const [rate, setRate] = useState<number | null>(null);

  const calculateRate = () => {
    const followerCount = parseInt(followers);
    const engagementRate = parseFloat(engagement);
    
    if (isNaN(followerCount) || isNaN(engagementRate)) return;
    
    // Simple calculation: $10 per 1000 followers + engagement rate multiplier
    const baseRate = (followerCount / 1000) * 10;
    const engagementMultiplier = 1 + (engagementRate / 100);
    const calculatedRate = Math.round(baseRate * engagementMultiplier);
    
    setRate(calculatedRate);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header showSignup />

      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <DollarSign className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-reckless text-4xl md:text-5xl font-medium">Influencer Rate Calculator</h1>
        </div>
        
        <p className="text-xl text-muted-foreground mb-12">
          Calculate your worth as an influencer or determine fair rates for collaborations.
        </p>

        <div className="bg-card p-8 rounded-3xl border-2 border-border mb-8">
          <div className="space-y-4 mb-6">
            <div>
              <label className="block mb-2 font-medium">Number of Followers</label>
              <Input 
                type="number"
                placeholder="e.g., 50000"
                value={followers}
                onChange={(e) => setFollowers(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">Engagement Rate (%)</label>
              <Input 
                type="number"
                step="0.1"
                placeholder="e.g., 3.5"
                value={engagement}
                onChange={(e) => setEngagement(e.target.value)}
              />
            </div>
          </div>
          
          <Button onClick={calculateRate} className="w-full">Calculate Rate</Button>
          
          {rate !== null && (
            <div className="mt-6 p-6 bg-primary/10 rounded-2xl text-center">
              <p className="text-sm text-muted-foreground mb-2">Suggested Rate Per Post</p>
              <p className="font-reckless text-4xl font-medium text-primary">${rate}</p>
            </div>
          )}
        </div>

        <div className="text-center">
          <p className="text-muted-foreground mb-4">Grow your influence with consistent posting</p>
          <Link to="/signup">
            <Button size="lg">Try Post Free</Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default InfluencerRateCalculator;
