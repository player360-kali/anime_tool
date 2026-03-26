import type { CardType } from "@/types/global";
import { Eye, Star, Heart } from "lucide-react";
import { ASSETS_URL } from "@/config/env";
import { cn } from "@/lib/utils";
import { useLike } from "@/store/useLike";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function AnimeCard({ card }: { card: CardType }) {
  const toggle = useLike((s) => s.toggle);
  const isLiked = useLike((s) => s.isLiked(card._id));
  const navigate = useNavigate();

  return (
    <div
      title={card.name.uz}
      className="group relative aspect-2/3 rounded-xl overflow-hidden cursor-pointer border-2 border-border/80 bg-muted"
      onClick={() => navigate("/anime/" + card._id)}
    >
      <img
        src={ASSETS_URL + card.image}
        alt={card.name.uz}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />

      <button
        onClick={(e) => {
          e.stopPropagation();

          toggle(card._id);

          toast(
            <div className="flex gap-1">
              <span>{isLiked ? "You unliked" : "You liked"}</span>
              <span className="text-red-500 font-bold">{card.name.uz}</span>
            </div>,
            { duration: 1000 },
          );
        }}
        className={cn(
          "absolute top-2 right-2 p-1.5 rounded-lg backdrop-blur-sm transition-all duration-200",
          "opacity-0 group-hover:opacity-100",
          isLiked && "opacity-100",
          isLiked
            ? "bg-primary text-primary-foreground"
            : "bg-black/40 text-white/70 hover:text-white",
        )}
      >
        <Heart
          className={cn(
            "size-3.5 transition-all duration-200 cursor-pointer",
            isLiked && "fill-current scale-110",
          )}
        />
      </button>

      {card.category?.[1] && (
        <div className="absolute top-2 left-2">
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-primary/80 text-primary-foreground backdrop-blur-sm">
            {card.category[1].nameuz}
          </span>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
        <p className="text-white text-xs font-medium leading-snug line-clamp-2 mb-2">
          {card.name.uz}
        </p>
        <div className="flex items-center gap-2 text-white/50 text-[10px]">
          <span className="flex items-center gap-1">
            <Star className="size-2.5 fill-yellow-400 text-yellow-400" />
            {card.rating?.toFixed(1) ?? "—"}
          </span>
          <span className="w-px h-2.5 bg-white/20" />
          <span className="flex items-center gap-1">
            <Eye className="size-2.5" />
            {card.view >= 1000
              ? `${(card.view / 1000).toFixed(1)}K`
              : card.view}
          </span>
          <span className="w-px h-2.5 bg-white/20" />
          <span>{card.year}</span>
        </div>
      </div>

      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ring-1 ring-primary/60" />
    </div>
  );
}

export default AnimeCard;
