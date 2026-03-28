import { useEffect, useRef, useCallback } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { filter } from "@/api/search";
import { Skeleton } from "@/components/ui/skeleton";
import AnimeCard from "@/components/anime-card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

function CardSkeleton() {
  return (
    <div className="aspect-2/3 rounded-xl overflow-hidden">
      <Skeleton className="w-full h-full" />
    </div>
  );
}

const GRID =
  "container mx-auto mt-5 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4";
const LIMIT = 12;

interface CardGroupProps {
  category?: string[];
  janr?: string[];
  year?: string[];
  variant?: "infinite" | "paginated";
}

function InfiniteCardGroup({
  category,
  janr,
  year,
}: Omit<CardGroupProps, "variant">) {
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
      if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
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
      <div className={GRID}>
        {isLoading
          ? Array.from({ length: LIMIT }).map((_, i) => (
              <CardSkeleton key={i} />
            ))
          : cards.map((card) => <AnimeCard key={card._id} card={card} />)}
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
}

function PaginatedCardGroup({
  category,
  janr,
  year,
}: Omit<CardGroupProps, "variant">) {
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["CARDS_PAGE", { category, janr, year, page }],
    queryFn: () => filter(page, LIMIT, category, janr, year),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    setPage(1);
  }, [category, janr, year]);

  const cards = data?.data ?? [];
  const totalPages = data?.pagination.totalPages ?? 1;
  const loading = isLoading || isFetching;

  return (
    <section className="space-y-6">
      <div className={GRID}>
        {loading
          ? Array.from({ length: LIMIT }).map((_, i) => (
              <CardSkeleton key={i} />
            ))
          : cards.map((card) => <AnimeCard key={card._id} card={card} />)}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pb-8">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1 || loading}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft className="size-4" />
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const p =
                totalPages <= 5
                  ? i + 1
                  : page <= 3
                    ? i + 1
                    : page >= totalPages - 2
                      ? totalPages - 4 + i
                      : page - 2 + i;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  disabled={loading}
                  className={`w-8 h-8 rounded-md text-xs font-medium transition-colors ${
                    p === page
                      ? "bg-brand text-white"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages || loading}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}
    </section>
  );
}

export const CardGroup = ({
  category = [],
  janr = [],
  year = [],
  variant = "infinite",
}: CardGroupProps) => {
  if (variant === "paginated") {
    return <PaginatedCardGroup category={category} janr={janr} year={year} />;
  }
  return <InfiniteCardGroup category={category} janr={janr} year={year} />;
};
