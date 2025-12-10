import { usePosts } from "@/hooks/usePost";
import LargePostCard from "@/components/molecules/LargePostCard";
import { BackButton } from "@/components/atoms/common/buttons/BackButton";

export default function PostsList() {
  const { posts, isLoading } = usePosts();

  if (isLoading) return <p className="mt-8 text-center">Carregando...</p>;
  if (!posts.length)
    return <p className="mt-8 text-center">Nenhum post encontrado.</p>;

  return (
    <div>
      <div className="flex items-center justify-start mb-6">
        <BackButton to="/" />
        <span className="w-full text-center">
          <h1 className="text-center text-2xl text-primary font-bold">
            Todos os Posts
          </h1>
        </span>
      </div>
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid gap-6 grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
          {posts.map((post) => (
            <LargePostCard key={post.documentId} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
