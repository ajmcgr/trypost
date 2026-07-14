import PostList from '@/components/dashboard/PostList';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

const Drafts = () => (
  <>
    <PostList title="Draft Posts" emptyLabel="No drafts saved" statuses={["draft"]} />
    <div className="container mx-auto px-6 pb-8">
      <Alert className="border-muted">
        <Info className="h-4 w-4 text-muted-foreground" />
        <AlertDescription className="text-muted-foreground">
          Draft posts older than 90 days are automatically deleted to keep your workspace organized.
        </AlertDescription>
      </Alert>
    </div>
  </>
);

export default Drafts;
