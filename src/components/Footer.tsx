import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-5 gap-8">
          <div>
            <h4 className="font-semibold mb-4">About</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-muted-foreground hover:text-foreground">About</Link></li>
              <li><a href="https://blog.works.xyz" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">Blog</a></li>
              <li><a href="https://discord.gg/vNyMmrRDXA" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">Community</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="mailto:support@trypost.ai" className="text-muted-foreground hover:text-foreground">Support</a></li>
              <li><Link to="/privacy" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Platforms</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/platforms/instagram" className="text-muted-foreground hover:text-foreground">Instagram</Link></li>
              <li><Link to="/platforms/youtube" className="text-muted-foreground hover:text-foreground">YouTube</Link></li>
              <li><Link to="/platforms/tiktok" className="text-muted-foreground hover:text-foreground">TikTok</Link></li>
              <li><Link to="/platforms/twitter" className="text-muted-foreground hover:text-foreground">X (Twitter)</Link></li>
              <li><Link to="/platforms/facebook" className="text-muted-foreground hover:text-foreground">Facebook</Link></li>
              <li><Link to="/platforms/whatsapp" className="text-muted-foreground hover:text-foreground">WhatsApp</Link></li>
              <li><Link to="/platforms/telegram" className="text-muted-foreground hover:text-foreground">Telegram</Link></li>
              <li><Link to="/platforms/threads" className="text-muted-foreground hover:text-foreground">Threads</Link></li>
              <li><Link to="/platforms/snapchat" className="text-muted-foreground hover:text-foreground">Snapchat</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Free Tools</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/tools/hashtag-generator" className="text-muted-foreground hover:text-foreground">Hashtag Generator</Link></li>
              <li><Link to="/tools/content-planner" className="text-muted-foreground hover:text-foreground">Content Planner</Link></li>
              <li><Link to="/tools/influencer-rate-calculator" className="text-muted-foreground hover:text-foreground">Influencer Rate Calculator</Link></li>
              <li><Link to="/tools/bio-text-generator" className="text-muted-foreground hover:text-foreground">Bio Text Generator</Link></li>
              <li><Link to="/tools/caption-generator" className="text-muted-foreground hover:text-foreground">Caption Generator</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="https://x.com/trypostai" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">X</a></li>
              <li><a href="https://discord.gg/vNyMmrRDXA" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">Discord</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          Copyright © 2025 Works App, Inc. Built with ♥️ by <a href="https://works.xyz" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Works</a>.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
