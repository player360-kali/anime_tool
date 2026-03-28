import { useHistory } from "@/store/useHistory";
import { getSingle } from "@/api/search";
import { useQueries } from "@tanstack/react-query";
import AnimeCard from "@/components/anime-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Trash2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 12;
const JUST_DATE = Date.now();

function CardSkeleton() {
  return (
    <div className="aspect-2/3 rounded-xl overflow-hidden">
      <Skeleton className="w-full h-full" />
    </div>
  );
}

function HistoryCard({
  card,
  watchedAt,
  onRemove,
}: {
  card: { _id: string; name: { uz: string }; image: string };
  watchedAt: number;
  onRemove: () => void;
}) {
  const timeAgo = (ts: number) => {
    const diff = JUST_DATE - ts;
    const h = Math.floor(diff / 3600000);
    const d = Math.floor(diff / 86400000);
    if (d > 0) return `${d} kun oldin`;
    if (h > 0) return `${h} soat oldin`;
    return "Hozirgina";
  };

  return (
    <div className="relative group">
      <AnimeCard card={card as never} />

      <div className="absolute top-8.5 left-2 z-10 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-sm">
        <Clock className="size-3 text-white/70" />
        <span className="text-[12px] text-white/70">{timeAgo(watchedAt)}</span>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className={cn(
          "absolute top-9 right-2.5 z-10",
          "p-1.5 rounded-lg backdrop-blur-sm transition-all duration-200",
          "bg-black/50 text-white/80",
          "md:hover:bg-destructive md:hover:text-white",
        )}
      >
        <Trash2 className="size-3" />
      </button>
    </div>
  );
}

const HistoryPage = () => {
  const { history, remove, clear } = useHistory();
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(history.length / PAGE_SIZE);
  const pageItems = history.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const results = useQueries({
    queries: pageItems.map((item) => ({
      queryKey: ["ANIME", item.id],
      queryFn: () => getSingle(item.id),
      staleTime: 1000 * 60 * 10,
    })),
  });

  const isLoading = results.some((r) => r.isLoading);

  if (history.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-xl font-semibold mb-6">History</h1>
        <p className="text-muted-foreground text-sm">History is empty</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">
          History
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            ({history.length})
          </span>
        </h1>
        <Button
          variant={"outline"}
          onClick={() => {
            clear();
            setPage(1);
          }}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors"
        >
          <Trash2 className="size-3.5" />
          Clear all
        </Button>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
        {isLoading
          ? Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <CardSkeleton key={i} />
            ))
          : pageItems.map((item, i) => {
              const card = results[i]?.data?.data;
              if (!card) return <CardSkeleton key={item.id} />;
              return (
                <HistoryCard
                  key={item.id}
                  card={card}
                  watchedAt={item.watchedAt}
                  onRemove={() => {
                    remove(item.id);
                    const newTotal = history.length - 1;
                    const newTotalPages = Math.ceil(newTotal / PAGE_SIZE);
                    if (page > newTotalPages)
                      setPage((p) => Math.max(p - 1, 1));
                  }}
                />
              );
            })}
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

export default HistoryPage;
