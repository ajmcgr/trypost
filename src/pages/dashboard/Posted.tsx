import { CheckCircle2 } from "lucide-react";

const Posted = () => {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Posted</h1>
        <p className="text-muted-foreground">View all your published posts</p>
      </div>
      
      <div className="flex items-center justify-center h-96 bg-muted/30 rounded-3xl">
        <div className="text-center">
          <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg text-muted-foreground">No published posts yet</p>
        </div>
      </div>
    </div>
  );
};

export default Posted;
