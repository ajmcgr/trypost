import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import postLogo from "@/assets/post-logo.png";
import LanguageDropdown from "@/components/LanguageDropdown";

interface HeaderProps {
  showSignup?: boolean;
  showPricing?: boolean;
}

const Header = ({ showSignup = false, showPricing = false }: HeaderProps) => {
  const { user } = useAuth();

  return (
    <header className="bg-card">
      <div className="max-w-[1220px] mx-auto px-6 sm:px-8 py-3 sm:py-4 flex items-center justify-between gap-4">
        <a href="https://trypost.ai" className="flex items-center gap-2 shrink-0">
          <img src={postLogo} alt="Post" className="h-6 sm:h-8" />
        </a>
        <div className="flex items-center gap-3 sm:gap-6">
          {showPricing && (
            <>
              <Link
                to="/pricing"
                className="hidden md:inline text-[15px] font-medium text-foreground hover:text-primary transition-colors"
              >
                Pricing
              </Link>
              <a
                href="https://blog.works.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline text-[15px] font-medium text-foreground hover:text-primary transition-colors"
              >
                Resources
              </a>
              <a
                href="mailto:alexander.macgregor@gmail.com?subject=Request%20Demo%20-%20Post"
                className="hidden lg:inline text-[15px] font-medium text-foreground hover:text-primary transition-colors"
              >
                Request Demo
              </a>
            </>
          )}
          <LanguageDropdown />
          {user ? (
            <Link to="/dashboard">
              <Button className="rounded-2xl px-6 py-5 text-sm sm:text-base">Go to Dashboard →</Button>
            </Link>
          ) : (
            showSignup && (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="px-2 text-[15px] font-medium text-foreground hover:bg-transparent hover:text-primary">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="rounded-2xl px-8 py-5 text-[15px] font-semibold">
                    Sign Up
                  </Button>
                </Link>
              </>
            )
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
