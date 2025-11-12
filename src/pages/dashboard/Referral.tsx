import { Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const Referral = () => {
  const referralLink = "https://trypost.ai/ref/user123";

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Earn 30% Referral</h1>
        <p className="text-muted-foreground">Invite friends and earn rewards</p>
      </div>
      
      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Your Referral Link</CardTitle>
            <CardDescription>Share this link with friends to earn 30% commission</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input value={referralLink} readOnly />
              <Button onClick={() => navigator.clipboard.writeText(referralLink)}>
                Copy
              </Button>
            </div>
            <div className="bg-muted/30 rounded-lg p-6">
              <div className="flex items-center justify-center gap-2 text-center">
                <Gift className="w-12 h-12 text-muted-foreground" />
                <div>
                  <p className="text-3xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Referrals</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Referral;
