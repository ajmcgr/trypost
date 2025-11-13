import { useState, useEffect } from "react";
import { Loader2, ThumbsUp, Info, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";

interface PublishingLoaderProps {
  onCheckStatus?: () => void;
  autoRefresh?: boolean;
}

const PublishingLoader = ({ onCheckStatus, autoRefresh = true }: PublishingLoaderProps) => {
  const navigate = useNavigate();
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        setRefreshCount((prev) => prev + 1);
        onCheckStatus?.();
      }, 5000); // Auto-refresh every 5 seconds

      return () => clearInterval(interval);
    }
  }, [autoRefresh, onCheckStatus]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="max-w-md w-full space-y-8 text-center animate-fade-in">
        {/* Loading Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center">
              <ThumbsUp className="w-10 h-10 text-emerald-600" />
            </div>
            <div className="absolute inset-0">
              <Loader2 className="w-24 h-24 text-emerald-500 animate-spin" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Publishing post.</h1>
          <p className="text-muted-foreground">
            Publishing your post to all the places
          </p>
        </div>

        {/* Info Alert */}
        <Alert className="bg-muted/50 border-muted">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Posts can take up to 10 minutes to show on all platforms.
          </AlertDescription>
        </Alert>

        {/* Check Status Button */}
        <div className="space-y-2">
          <Button
            onClick={onCheckStatus}
            className="bg-emerald-500 hover:bg-emerald-600 w-full"
          >
            Check Status
          </Button>
          {autoRefresh && (
            <p className="text-sm text-muted-foreground">
              Auto-refreshing to check status
            </p>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Create Another Post Link */}
        <button
          onClick={() => navigate("/dashboard")}
          className="text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center gap-2 group"
        >
          Create another post while you wait
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default PublishingLoader;