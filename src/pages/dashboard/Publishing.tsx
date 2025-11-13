import { useNavigate, useLocation } from "react-router-dom";
import PublishingLoader from "@/components/PublishingLoader";
import { toast } from "sonner";

const Publishing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const postId = location.state?.postId;

  const handleCheckStatus = () => {
    // TODO: Implement actual status check with post ID
    console.log("Checking status for post:", postId);
    
    // Simulate status check - replace with actual API call
    const isPublished = Math.random() > 0.3;
    
    if (isPublished) {
      toast.success("Post published successfully!");
      navigate("/dashboard/posted");
    } else {
      toast.info("Still publishing...");
    }
  };

  return (
    <PublishingLoader 
      onCheckStatus={handleCheckStatus}
      autoRefresh={true}
    />
  );
};

export default Publishing;