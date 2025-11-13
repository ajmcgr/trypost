import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const Feedback = () => {
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      toast.error("Please enter your feedback");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-feedback', {
        body: { feedback }
      });

      if (error) throw error;

      toast.success("Thank you for your feedback!");
      setFeedback("");
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Feedback;
