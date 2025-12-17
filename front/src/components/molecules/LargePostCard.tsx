import { NavLink } from "react-router";
import { Post } from "@/types/strapi/Post";
import { getMainImageUrl } from "@/utils/image-utils";
import { cn } from "@/utils/style-utils";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

type LargePostCardProps = {
  post: Post;
};

export default function LargePostCard({ post }: LargePostCardProps) {
  const mainImage =
    post?.imagem && post.imagem.length > 0 ? post.imagem[0] : undefined;
  const imageUrl = getMainImageUrl(mainImage);

  return (
    <NavLink
      to={`/posts/${post.documentId}`}
      draggable={false}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-gray-300",
        "bg-white p-4 shadow-md transition-shadow duration-200",
        "hover:shadow-lg cursor-pointer block"
      )}
    >
      <div className="relative h-64 w-full overflow-hidden rounded-t-2xl shadow mb-4">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={post.titulo || "Post image"}
            draggable={false}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gray-200" />
        )}
      </div>

      <h2 className="mb-2 text-xl font-semibold leading-tight text-black line-clamp-2">
        {post.titulo}
      </h2>

      <p className="mb-3 text-sm leading-tight line-clamp-3 text-gray-700">
        {post.descricao || post.minibio}
      </p>

      <div className="flex items-center gap-2 text-xs text-gray-500">
        {post.horario && (
          <>
            <span>{post.horario}</span>
            {post.endereco && <span>•</span>}
          </>
        )}
        {post.endereco && <span>{post.endereco}</span>}
      </div>
    </NavLink>
  );
}

export function LargePostCardSkeleton() {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-gray-300",
        "bg-white p-4 shadow-md"
      )}
    >
      <div className="relative h-64 w-full overflow-hidden rounded-t-2xl shadow mb-4">
        <Skeleton height="100%" className="rounded-t-2xl" />
      </div>

      <div className="mb-2">
        <Skeleton height={24} className="mb-1" />
        <Skeleton height={24} width="80%" />
      </div>

      <div className="mb-3">
        <Skeleton height={16} className="mb-1" />
        <Skeleton height={16} className="mb-1" />
        <Skeleton height={16} width="70%" />
      </div>

      <Skeleton height={14} width="60%" />
    </div>
  );
}
