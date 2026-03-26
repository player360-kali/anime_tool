import { getSingle } from "@/api/search";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { ASSETS_URL } from "@/config/env";
import { useLike } from "@/store/useLike";
import { useHistory } from "@/store/useHistory";
import { cn } from "@/lib/utils";
import {
  Eye,
  Star,
  Heart,
  Calendar,
  Building2,
  Globe,
  Clapperboard,
  Users,
} from "lucide-react";
import { useEffect } from "react";
import Dubers from "@/components/dubers";
import Parts from "@/components/parts";
import Screens from "@/components/screens";
import AnimeSkeleton from "@/components/skeleton/anime";
import Comment from "@/components/comments";
import toast from "react-hot-toast";

const AnimePage = () => {
  const { sId = "" } = useParams();
  const toggle = useLike((s) => s.toggle);
  const isLiked = useLike((s) => s.isLiked(sId));
  const addHistory = useHistory((s) => s.add);

  const { data: res, isLoading } = useQuery({
    queryKey: ["ANIME", sId],
    queryFn: () => getSingle(sId),
    staleTime: 1000 * 60 * 5,
  });

  const anime = res?.data;
  const series = res?.seria ?? [];
  const comments = res?.comment ?? [];

  useEffect(() => {
    if (!anime) return;
    addHistory({
      id: anime._id,
      title: anime.name.uz,
      image: anime.image,
    });
  }, [anime, addHistory]);

  if (isLoading) return <AnimeSkeleton />;
  if (!anime) return null;

  return (
    <div className="w-full min-h-screen">
      <div className="container mx-auto relative">
        <div
          className="absolute inset-0 bg-cover bg-center scale-106"
          style={{ backgroundImage: `url(${ASSETS_URL + anime.image})` }}
        >
          <div className="absolute inset-0 bg-background/80 backdrop-blur-2xl" />
        </div>

        <div className="relative container mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="shrink-0">
              <div className="relative w-full md:w-56 aspect-2/3 rounded-xl overflow-hidden border-2 border-border shadow-2xl">
                <img
                  src={ASSETS_URL + anime.image}
                  alt={anime.name.uz}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => {
                    toggle(sId);
                    toast(
                      <div className="flex gap-1">
                        <span>{isLiked ? "You unliked" : "You liked"}</span>
                        <span className="text-red-500 font-bold">
                          {anime.name.uz}
                        </span>
                      </div>,
                      { duration: 1000 },
                    );
                  }}
                  className={cn(
                    "absolute cursor-pointer top-3 right-3 p-2 rounded-lg backdrop-blur-sm transition-all",
                    isLiked
                      ? "bg-primary/90 text-primary-foreground"
                      : "bg-black/40 text-white/70 hover:text-white",
                  )}
                >
                  <Heart className={cn("size-4", isLiked && "fill-current")} />
                </button>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
                  {anime.name.uz}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {anime.name.ru}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Star className="size-4 fill-yellow-400 text-yellow-400" />
                  {anime.rating?.toFixed(1) || "—"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye className="size-4" />
                  {anime.view >= 1000
                    ? `${(anime.view / 1000).toFixed(0)}K`
                    : anime.view}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="size-4" />
                  {anime.year}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clapperboard className="size-4" />
                  {anime.tip === "serial" ? "Serial" : "Film"}
                </span>
                {anime.num && (
                  <span className="text-xs px-2 py-0.5 rounded-md bg-primary/20 text-primary border border-primary/30">
                    {anime.num}-qism
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {anime.janr.map((j) => (
                  <span
                    key={j._id}
                    className="text-xs px-2.5 py-1 rounded-md bg-muted text-muted-foreground border border-border/60"
                  >
                    {j.nameuz}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                {anime.studia && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="size-4 shrink-0" />
                    <span>{anime.studia}</span>
                  </div>
                )}
                {anime.country && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Globe className="size-4 shrink-0" />
                    <span>{anime.country}</span>
                  </div>
                )}
                {anime.rejissor && (
                  <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                    <Users className="size-4 shrink-0" />
                    <span className="line-clamp-1">{anime.rejissor}</span>
                  </div>
                )}
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4 md:line-clamp-none">
                {anime.description.uz}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-10">
        {series.length > 0 && <Parts series={series} />}

        {anime.screens.thumb.length > 0 && <Screens screens={anime.screens} />}

        {anime.translator.length > 0 && (
          <Dubers translator={anime.translator} />
        )}

        {comments.length > 0 && <Comment comments={comments} />}
      </div>
    </div>
  );
};

export default AnimePage;
