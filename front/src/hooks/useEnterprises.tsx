import { getEnterprises } from "@/api/Strapi";
import { EnterprisesCacheKeys } from "@/constants/cache-keys/enterprises-cache-keys";
import { useQuery } from "@tanstack/react-query";

export const useEnterprises = () => {
  const { data, isFetching, error, isError } = useQuery({
    queryKey: [EnterprisesCacheKeys.ENTERPRISES],
    queryFn: getEnterprises,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 30 * 1000,
  });

  return {
    data: data ?? [],
    isFetching,
    error: {
      obj: error,
      isError,
    },
  };
};
