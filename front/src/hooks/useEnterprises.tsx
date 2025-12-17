import { getEnterprises } from "@/api/Strapi";
import { EnterprisesCacheKeys } from "@/constants/cache-keys/enterprises-cache-keys";
import { useInfiniteQuery } from "@tanstack/react-query";
import { PageRequest } from "@/types/common/pagination/PageRequest";
import { useMemo } from "react";

export const useEnterprises = (
  pageRequest: PageRequest = { page: 1, pageSize: 20 }
) => {
  const {
    data,
    isFetching,
    error,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [
      EnterprisesCacheKeys.ENTERPRISES,
      pageRequest.page,
      pageRequest.pageSize,
    ],
    queryFn: ({ pageParam }) => getEnterprises(pageParam as PageRequest),
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

  const enterprises = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data]
  );

  return {
    data: enterprises,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error: {
      obj: error,
      isError,
    },
  };
};
