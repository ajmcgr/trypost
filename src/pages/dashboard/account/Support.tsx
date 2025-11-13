import { Mail, MessageSquare, FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Support = () => {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Support</h1>
        <p className="text-muted-foreground">Get help when you need it</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <Mail className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>Email Support</CardTitle>
            <CardDescription>Get in touch with our support team</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              onClick={() => window.location.href = "mailto:alex@trypost.ai"}
            >
              <Mail className="mr-2 h-4 w-4" />
              Contact Support
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <FileText className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>Documentation</CardTitle>
            <CardDescription>Browse our help articles and guides</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              View Docs
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <MessageSquare className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>Community</CardTitle>
            <CardDescription>Join our community forum</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline">
              <MessageSquare className="mr-2 h-4 w-4" />
              Visit Forum
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <ExternalLink className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>Status Page</CardTitle>
            <CardDescription>Check our system status</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline">
              <ExternalLink className="mr-2 h-4 w-4" />
              View Status
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">How do I connect my social accounts?</h3>
            <p className="text-sm text-muted-foreground">
              Go to Social Platforms in the sidebar and click on the platform you want to connect. Follow the authorization process to link your account.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Can I schedule posts in advance?</h3>
            <p className="text-sm text-muted-foreground">
              Yes! Create a post and select a future date and time to schedule it for automatic publishing.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">How do I upgrade my plan?</h3>
            <p className="text-sm text-muted-foreground">
              Visit the Plans page in your account menu and select the plan you want to upgrade to.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Support;