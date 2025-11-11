import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import Header from "@/components/Header";

const Signup = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex items-center justify-center p-6 pt-16">
        <div className="w-full max-w-md">

        <Card className="p-8 rounded-3xl border-2">
          <h1 className="text-3xl font-bold mb-2 text-center">Get started free</h1>
          <p className="text-muted-foreground text-center mb-8">
            Create your account in seconds
          </p>

          <form className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Jane Doe"
                className="mt-1 rounded-xl"
              />
            </div>
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
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </div>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-8">
          By signing up, you agree to our{" "}
          <Link to="/terms" className="hover:underline">Terms</Link>
          {" and "}
          <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
        </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
