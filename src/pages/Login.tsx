import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import Header from "@/components/Header";

const Login = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex items-center justify-center p-6 pt-16">
        <div className="w-full max-w-md">

        <Card className="p-8 rounded-3xl border-2">
          <h1 className="text-3xl font-bold mb-2 text-center">Welcome back</h1>
          <p className="text-muted-foreground text-center mb-8">
            Sign in to your account
          </p>

          <form className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="mt-1 rounded-xl"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="mt-1 rounded-xl"
              />
            </div>
            <Button className="w-full rounded-xl" size="lg">
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link to="/signup" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </div>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-8">
          <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
          {" · "}
          <Link to="/terms" className="hover:underline">Terms of Service</Link>
        </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
