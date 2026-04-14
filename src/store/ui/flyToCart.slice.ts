import { create } from "zustand";

export type FlyItem = {
  id: string;
  image: string;
  startX: number;
  startY: number;
  startWidth: number;
};

interface FlyToCartState {
  items: FlyItem[];
  addFlyItem: (item: Omit<FlyItem, "id">) => void;
  removeFlyItem: (id: string) => void;
}

export const useFlyToCartStore = create<FlyToCartState>((set) => ({
  items: [],
  addFlyItem: (item) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({ items: [...state.items, { ...item, id }] }));
  },
  removeFlyItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    })),
}));
