import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import PublishingLoader from "@/components/PublishingLoader";
import { toast } from "sonner";

const Publishing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const postData = location.state?.postData;
  const successful = location.state?.successful;
  const total = location.state?.total;
  const [checkCount, setCheckCount] = useState(0);

  // If no post data, redirect back to composer
  useEffect(() => {
    if (!postData) {
      toast.error("No post data found");
      navigate("/dashboard/composer");
    }
  }, [postData, navigate]);

  useEffect(() => {
    if (postData) {
      // Auto-redirect after a few seconds since publishing is already complete
      const timer = setTimeout(() => {
        handleCheckStatus();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [postData]);

  const handleCheckStatus = () => {
    setCheckCount((prev) => prev + 1);
    
    // Since publishing already happened in composer, redirect to posts page
    if (successful === total) {
      toast.success(`Successfully published to all ${successful} platforms!`);
      navigate("/dashboard/posts");
    } else if (successful > 0) {
      toast.warning(`Published to ${successful} of ${total} platforms`);
      navigate("/dashboard/posts");
    } else {
      toast.error("Publishing failed. Please try again.");
      navigate("/dashboard/composer", { state: { content: postData?.content } });
    }
  };

  if (!postData) {
    return null;
  }

  return (
    <PublishingLoader 
      onCheckStatus={handleCheckStatus}
      autoRefresh={true}
    />
  );
};

export default Publishing;