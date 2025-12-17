import { useEnterprises } from "@/hooks/useEnterprises";
import LargeEnterpriseCard, {
  LargeEnterpriseCardSkeleton,
} from "@/components/molecules/LargeEnterpriseCard";
import { BackButton } from "@/components/atoms/common/buttons/BackButton";
import InfiniteScroll from "react-infinite-scroll-component";
import { cn } from "@/utils/style-utils";

function EnterpriseGrid({
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
        <LargeEnterpriseCardSkeleton key={`skeleton-${index}`} />
      ))}
    </>
  );
}

export default function EnterprisesList() {
  const {
    data: enterprises,
    isFetching,
    fetchNextPage,
    hasNextPage,
  } = useEnterprises();

  const isLoading = isFetching && !enterprises.length;
  const isEmpty = !isFetching && !enterprises.length;

  if (isEmpty) {
    return (
      <p className="mt-8 text-center">Nenhum empreendimento encontrado.</p>
    );
  }

  const content = isLoading ? (
    <EnterpriseGrid>
      <SkeletonLoader count={6} />
    </EnterpriseGrid>
  ) : (
    <InfiniteScroll
      key="enterprises-infinite-scroll"
      dataLength={enterprises.length}
      next={fetchNextPage}
      hasMore={hasNextPage ?? false}
      loader={
        <EnterpriseGrid className="my-6">
          <SkeletonLoader count={2} />
        </EnterpriseGrid>
      }
      endMessage={<div className="mt-8 text-center"></div>}
      scrollableTarget="enterprises-scroll-container"
    >
      <EnterpriseGrid>
        {enterprises.map((enterprise) => (
          <LargeEnterpriseCard key={enterprise.id} enterprise={enterprise} />
        ))}
      </EnterpriseGrid>
    </InfiniteScroll>
  );

  return (
    <div
      id="enterprises-scroll-container"
      className="h-full overflow-y-auto flex flex-col p-2"
    >
      <div className="flex items-center justify-start mb-6 shrink-0">
        <BackButton to="/" />
        <span className="w-full text-center">
          <h1 className="text-center text-2xl text-primary font-bold">
            Todos os Empreendimentos
          </h1>
        </span>
      </div>
      <div className="max-w-7xl mx-auto px-4 flex-1 min-h-0">{content}</div>
    </div>
  );
}
