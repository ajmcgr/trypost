import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase parses the recovery token from the URL hash and emits a PASSWORD_RECOVERY event.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });

    // Also check if a session is already present (link just clicked).
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });

    // If after a moment there's still no recovery context, mark invalid.
    const t = setTimeout(() => {
      supabase.auth.getSession().then(({ data }) => {
        if (!data.session) setInvalid(true);
      });
    }, 1500);

    return () => {
      subscription.unsubscribe();
      clearTimeout(t);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast({ title: "Password too short", description: "Use at least 8 characters.", variant: "destructive" });
      return;
    }
    if (password !== confirm) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast({ title: "Couldn't update password", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Password updated", description: "You're now signed in." });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex items-center justify-center p-6 pt-16">
        <div className="w-full max-w-md">
          <Card className="p-8 rounded-3xl border-2">
            <h1 className="text-3xl font-bold mb-2 text-center">Set a new password</h1>
            <p className="text-muted-foreground text-center mb-8">
              Choose a strong password for your account.
            </p>

            {invalid && !ready ? (
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  This reset link is invalid or has expired.
                </p>
                <Button asChild className="w-full rounded-xl">
                  <Link to="/forgot-password">Request a new link</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="password">New password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="mt-1 rounded-xl"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading || !ready}
                  />
                </div>
                <div>
                  <Label htmlFor="confirm">Confirm password</Label>
                  <Input
                    id="confirm"
                    type="password"
                    placeholder="••••••••"
                    className="mt-1 rounded-xl"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    disabled={loading || !ready}
                  />
                </div>
                <Button className="w-full rounded-xl" size="lg" type="submit" disabled={loading || !ready}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update password"}
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResetPassword;
