import { getPost, getPosts } from "../api/Strapi";
import { Post } from "@/types/strapi/Post";
import { PostsCacheKeys } from "@/constants/cache-keys/posts-cache-keys";
import { useInfiniteQuery } from "@tanstack/react-query";
import { PageRequest } from "@/types/common/pagination/PageRequest";
import { useMemo } from "react";
import { useCallback, useEffect, useState } from "react";

export function usePosts(pageRequest: PageRequest = { page: 1, pageSize: 20 }) {
  const {
    data,
    isFetching,
    error,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [PostsCacheKeys.POSTS, pageRequest.page, pageRequest.pageSize],
    queryFn: ({ pageParam }) => getPosts(pageParam as PageRequest),
    initialPageParam: { page: 1, pageSize: pageRequest.pageSize },
    getNextPageParam: (lastPage) => {
      const { page, pageCount } = lastPage.meta.pagination;
      return page < pageCount
        ? { page: page + 1, pageSize: pageRequest.pageSize }
        : undefined;
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 30 * 1000,
  });

  const posts = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data]
  );

  return {
    data: posts,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error: {
      obj: error,
      isError,
    },
  };
}

export function usePost(postId?: string) {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPost = useCallback(async () => {
    if (!postId) return;
    try {
      setIsLoading(true);
      const fetchedPost = await getPost(postId);
      setPost(fetchedPost);
    } catch (error) {
      console.error("Erro ao buscar post:", error);
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  return { post, isLoading };
}
