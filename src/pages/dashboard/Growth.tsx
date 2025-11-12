import { BookOpen } from "lucide-react";

const Growth = () => {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Growth Guide</h1>
        <p className="text-muted-foreground">Learn strategies to grow your social media presence</p>
      </div>
      
      <div className="flex items-center justify-center h-96 bg-muted/30 rounded-3xl">
        <div className="text-center">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg text-muted-foreground">Growth guide coming soon</p>
        </div>
      </div>
    </div>
  );
};

export default Growth;
