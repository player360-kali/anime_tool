import { create } from "zustand";
import { persist } from "zustand/middleware";

const HISTORY_LIMIT = 50;

interface HistoryItem {
  id: string;
  title: string;
  image: string;
  watchedAt: number;
}

interface HistoryStore {
  history: HistoryItem[];
  add: (item: Omit<HistoryItem, "watchedAt">) => void;
  remove: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
}

export const useHistory = create<HistoryStore>()(
  persist(
    (set, get) => ({
      history: [],
      add: (item) =>
        set((state) => {
          const filtered = state.history.filter((h) => h.id !== item.id);
          const updated = [{ ...item, watchedAt: Date.now() }, ...filtered];
          return { history: updated.slice(0, HISTORY_LIMIT) };
        }),

      remove: (id) =>
        set((state) => ({
          history: state.history.filter((h) => h.id !== id),
        })),
      clear: () => set({ history: [] }),
      has: (id) => get().history.some((h) => h.id === id),
    }),
    { name: "anime-history" },
  ),
);
