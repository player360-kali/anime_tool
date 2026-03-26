import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LikeStore {
  liked: string[];
  toggle: (id: string) => void;
  isLiked: (id: string) => boolean;
}

export const useLike = create<LikeStore>()(
  persist(
    (set, get) => ({
      liked: [],
      toggle: (id) =>
        set((state) => ({
          liked: state.liked.includes(id)
            ? state.liked.filter((i) => i !== id)
            : [...state.liked, id],
        })),
      isLiked: (id) => get().liked.includes(id),
    }),
    { name: "anime-likes" },
  ),
);
