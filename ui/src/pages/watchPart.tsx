import { getStream, getSingle } from "@/api/search";
import AnimeSkeleton from "@/components/skeleton/anime";
import { HLSPlayer } from "@/components/player/HLSPlayer";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Play,
  ChevronLeft,
  ChevronRight,
  VideoOff,
  SkipForward,
  Loader2,
  RefreshCw,
} from "lucide-react";

const WatchPart = () => {
  const { sId = "", pId = "" } = useParams();
  const navigate = useNavigate();

  const { data: res, isLoading } = useQuery({
    queryKey: ["ANIME", sId],
    queryFn: () => getSingle(sId),
    staleTime: 1000 * 60 * 5,
  });

  const anime = res?.data;
  const series = res?.seria ?? [];
  const currentIndex = series.findIndex((s) => s._id === pId);
  const currentPart = series[currentIndex];
  const prevPart = series[currentIndex + 1];
  const nextPart = series[currentIndex - 1];

  const streamId = currentPart?.video?.split("/").pop();

  const {
    data: stream,
    isLoading: streamLoading,
    isError: streamError,
    refetch: refetchStream,
  } = useQuery({
    queryKey: ["STREAM", streamId],
    queryFn: () => getStream(streamId!),
    enabled: !!streamId,
    staleTime: 1000 * 60 * 30,
    retry: false,
  });

  const goTo = (id: string) => navigate(`/anime/${sId}/${id}`);

  if (isLoading) return <AnimeSkeleton />;
  if (!anime) return null;

  // Player content — 3 holat
  const renderPlayer = () => {
    if (streamLoading) {
      return (
        <div className="aspect-video bg-muted/40 rounded-xl border border-border/50 flex flex-col items-center justify-center gap-3">
          <Loader2 className="size-8 text-muted-foreground animate-spin" />
          <p className="text-sm text-muted-foreground">Video yuklanmoqda...</p>
        </div>
      );
    }

    if (streamError || !stream?.file) {
      return (
        <div className="aspect-video bg-muted/40 rounded-xl border border-border/50 flex flex-col items-center justify-center gap-4">
          <div className="size-14 rounded-full bg-muted flex items-center justify-center">
            <VideoOff className="size-6 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">
              {streamError ? "Xatolik yuz berdi" : "Video mavjud emas"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {streamError
                ? "Server bilan bog'lanishda muammo"
                : "Bu qism hali yuklanmagan"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {streamError && (
              <button
                onClick={() => void refetchStream()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted border border-border/60 text-sm hover:bg-muted/80 transition-colors"
              >
                <RefreshCw className="size-4" />
                Qayta urinish
              </button>
            )}
            {nextPart && (
              <button
                onClick={() => goTo(nextPart._id)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary text-sm hover:bg-primary/20 transition-colors"
              >
                <SkipForward className="size-4" />
                Keyingi qism
              </button>
            )}
          </div>
        </div>
      );
    }

    return (
      <HLSPlayer
        src={stream.file}
        title={`${anime.name.uz} — ${currentPart?.name.uz}`}
        skip={stream.skip}
        onEnded={() => nextPart && goTo(nextPart._id)}
      />
    );
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <button
            onClick={() => navigate(`/anime/${sId}`)}
            className="hover:text-foreground transition-colors"
          >
            {anime.name.uz}
          </button>
          <span>/</span>
          <span className="text-foreground">{currentPart?.name.uz}</span>
        </div>

        {/* Player */}
        <div className="rounded-xl overflow-hidden">{renderPlayer()}</div>

        {/* Prev / Next */}
        <div className="flex items-center gap-3">
          <button
            disabled={!prevPart}
            onClick={() => prevPart && goTo(prevPart._id)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border/60 text-sm text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="size-4" />
            Oldingi
          </button>
          <span className="flex-1 text-center text-sm font-medium">
            {currentPart?.name.uz}
          </span>
          <button
            disabled={!nextPart}
            onClick={() => nextPart && goTo(nextPart._id)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border/60 text-sm text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Keyingi
            <ChevronRight className="size-4" />
          </button>
        </div>

        {/* Parts grid */}
        <section>
          <h2 className="text-base font-medium mb-4">
            Barcha qismlar
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({series.length} ta)
            </span>
          </h2>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2">
            {series.map((s) => {
              const isActive = s._id === pId;
              return (
                <button
                  key={s._id}
                  onClick={() => goTo(s._id)}
                  className={cn(
                    "flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-medium border transition-all",
                    isActive
                      ? "bg-brand text-white border-transparent scale-105"
                      : s.status === "active"
                        ? "bg-primary/10 border-primary/40 text-primary hover:bg-primary/20"
                        : "bg-muted/50 border-border/50 text-muted-foreground hover:bg-muted",
                  )}
                >
                  {isActive && <Play className="size-2.5 fill-current" />}
                  {s.name.uz.replace("-qism", "")}
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default WatchPart;
