import { useEffect, useRef, useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { filter } from "@/api/search";
import { Skeleton } from "@/components/ui/skeleton";
import AnimeCard from "@/components/anime-card";

function CardSkeleton() {
  return (
    <div className="aspect-2/3 rounded-xl overflow-hidden">
      <Skeleton className="w-full h-full" />
    </div>
  );
}

const LIMIT = 12;

export const CardGroup = ({
  category = [],
  janr = [],
  year = [],
}: {
  category?: string[];
  janr?: string[];
  year?: string[];
}) => {
  const loaderRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ["CARDS", { category, janr, year }],
      queryFn: ({ pageParam }) =>
        filter(pageParam, LIMIT, category, janr, year),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        const { page, totalPages } = lastPage.pagination;
        return page < totalPages ? page + 1 : undefined;
      },
      staleTime: 1000 * 60 * 5,
    });

  const cards = data?.pages.flatMap((p) => p.data) ?? [];

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage],
  );

  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleObserver]);

  return (
    <section className="space-y-6">
      <div className="container mx-auto mt-5 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
        {isLoading
          ? Array.from({ length: LIMIT }).map((_, i) => (
              <CardSkeleton key={i} />
            ))
          : cards.map((card, i) => <AnimeCard key={i} card={card} />)}

        {isFetchingNextPage &&
          Array.from({ length: LIMIT }).map((_, i) => (
            <CardSkeleton key={`next-${i}`} />
          ))}
      </div>

      <div ref={loaderRef} className="h-10" />

      {!hasNextPage && !isLoading && (
        <p className="text-center text-sm text-muted-foreground pb-8">
          Barcha animelar yuklandi
        </p>
      )}
    </section>
  );
};
