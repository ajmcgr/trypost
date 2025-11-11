import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import postLogo from "@/assets/post-logo.png";

interface HeaderProps {
  showSignup?: boolean;
}

const Header = ({ showSignup = false }: HeaderProps) => {
  return (
    <header className="bg-card">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="https://trypost.ai" className="flex items-center gap-2">
          <img src={postLogo} alt="Post" className="h-8" />
        </a>
        {showSignup && (
          <Link to="/signup">
            <Button>Sign Up →</Button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
