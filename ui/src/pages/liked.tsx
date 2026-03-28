import { useLike } from "@/store/useLike";
import { getSingle } from "@/api/search";
import { useQueries } from "@tanstack/react-query";
import AnimeCard from "@/components/anime-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 12;

function CardSkeleton() {
  return (
    <div className="aspect-2/3 rounded-xl overflow-hidden">
      <Skeleton className="w-full h-full" />
    </div>
  );
}

const LikedPage = () => {
  const liked = useLike((s) => s.liked);
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(liked.length / PAGE_SIZE);

  const safePage = Math.min(page, totalPages);
  const pageIds = liked.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const results = useQueries({
    queries: pageIds.map((id) => ({
      queryKey: ["ANIME", id],
      queryFn: () => getSingle(id),
      staleTime: 1000 * 60 * 10,
    })),
  });

  const isLoading = results.some((r) => r.isLoading);
  const cards = results.filter((r) => r.data?.data).map((r) => r.data!.data);

  if (liked.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-xl font-semibold mb-6">Liked</h1>
        <p className="text-muted-foreground text-sm">Hali hech narsa yo'q</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-xl font-semibold">
        Liked
        <span className="ml-2 text-sm font-normal text-muted-foreground">
          ({liked.length})
        </span>
      </h1>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
        {isLoading
          ? Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <CardSkeleton key={i} />
            ))
          : cards.map((card) => <AnimeCard key={card._id} card={card} />)}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
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
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default LikedPage;
