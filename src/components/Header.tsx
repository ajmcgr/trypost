import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import postLogo from "@/assets/post-logo.png";

interface HeaderProps {
  showSignup?: boolean;
}

const Header = ({ showSignup = false }: HeaderProps) => {
  const { user } = useAuth();

  return (
    <header className="bg-card border-b">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
        <a href="https://trypost.ai" className="flex items-center gap-2 shrink-0">
          <img src={postLogo} alt="Post" className="h-6 sm:h-8" />
        </a>
        <nav className="hidden sm:flex flex-1 justify-center items-center gap-6 md:gap-8">
          <Link to="/pricing" className="text-xs sm:text-sm font-medium text-foreground hover:opacity-80 transition-colors">
            Pricing
          </Link>
          <Link to="/faq" className="text-xs sm:text-sm font-medium text-foreground hover:opacity-80 transition-colors">
            FAQ
          </Link>
          <Link to="/resources" className="text-xs sm:text-sm font-medium text-foreground hover:opacity-80 transition-colors">
            Resources
          </Link>
        </nav>
        {user ? (
          <Link to="/dashboard">
            <Button className="text-xs sm:text-sm">Go to Dashboard →</Button>
          </Link>
        ) : (
          showSignup && (
            <div className="flex items-center gap-2 sm:gap-4">
              <Link to="/login">
                <Button variant="ghost" className="text-xs sm:text-sm">Log In</Button>
              </Link>
              <Link to="/signup">
                <Button className="text-xs sm:text-sm">Sign Up →</Button>
              </Link>
            </div>
          )
        )}
      </div>
    </header>
  );
};

export default Header;
