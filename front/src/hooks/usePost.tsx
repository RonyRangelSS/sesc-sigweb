import { useCallback, useEffect, useState } from "react";
import Post from "../types/strapi/Post";
import { getPost, getPosts } from "../api/Strapi";

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      const fetchedPosts = await getPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error("Erro ao buscar posts:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return { posts, isLoading };
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
