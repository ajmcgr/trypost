import PostList from '@/components/dashboard/PostList';

const Scheduled = () => (
  <PostList title="Scheduled Posts" emptyLabel="No scheduled posts" statuses={["scheduled"]} />
);

export default Scheduled;
