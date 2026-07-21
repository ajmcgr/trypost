import PostList from '@/components/dashboard/PostList';

const Posted = () => (
  <PostList title="Successfully Posted" emptyLabel="No published posts yet" statuses={['posted']} layout="grid" />
);

export default Posted;
