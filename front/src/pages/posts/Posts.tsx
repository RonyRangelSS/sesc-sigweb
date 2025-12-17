import { usePosts } from "@/hooks/usePost";
import LargePostCard, {
  LargePostCardSkeleton,
} from "@/components/molecules/LargePostCard";
import { BackButton } from "@/components/atoms/common/buttons/BackButton";
import InfiniteScroll from "react-infinite-scroll-component";
import { cn } from "@/utils/style-utils";

function PostGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid gap-6 grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2",
        className
      )}
    >
      {children}
    </div>
  );
}

function SkeletonLoader({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <LargePostCardSkeleton key={`skeleton-${index}`} />
      ))}
    </>
  );
}

export default function PostsList() {
  const { data: posts, isFetching, fetchNextPage, hasNextPage } = usePosts();

  const isLoading = isFetching && !posts.length;
  const isEmpty = !isFetching && !posts.length;

  if (isEmpty) {
    return <p className="mt-8 text-center">Nenhum post encontrado.</p>;
  }

  const content = isLoading ? (
    <PostGrid>
      <SkeletonLoader count={6} />
    </PostGrid>
  ) : (
    <InfiniteScroll
      key="posts-infinite-scroll"
      dataLength={posts.length}
      next={fetchNextPage}
      hasMore={hasNextPage ?? false}
      loader={
        <PostGrid className="my-6">
          <SkeletonLoader count={2} />
        </PostGrid>
      }
      endMessage={<div className="mt-8 text-center"></div>}
      scrollableTarget="posts-scroll-container"
    >
      <PostGrid>
        {posts.map((post) => (
          <LargePostCard key={post.documentId} post={post} />
        ))}
      </PostGrid>
    </InfiniteScroll>
  );

  return (
    <div
      id="posts-scroll-container"
      className="h-full overflow-y-auto flex flex-col p-2"
    >
      <div className="flex items-center justify-start mb-6 shrink-0">
        <BackButton to="/" />
        <span className="w-full text-center">
          <h1 className="text-center text-2xl text-primary font-bold">
            Todos os Posts
          </h1>
        </span>
      </div>
      <div className="max-w-7xl mx-auto px-4 flex-1 min-h-0">{content}</div>
    </div>
  );
}
