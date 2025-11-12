import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const Feedback = () => {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Share Feedback</h1>
        <p className="text-muted-foreground">Help us improve Post with your feedback</p>
      </div>
      
      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Send us your feedback</CardTitle>
            <CardDescription>We'd love to hear your thoughts, suggestions, or issues</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea 
              placeholder="Tell us what you think..." 
              className="min-h-32"
            />
            <Button>Submit Feedback</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Feedback;
